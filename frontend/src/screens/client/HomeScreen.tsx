import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { DashboardTopBar } from '../../components/common/DashboardTopBar';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { FadeIn } from '../../components/common/FadeIn';
import { PressableScale } from '../../components/common/PressableScale';
import { LoadingView } from '../../components/common/LoadingView';
import { TechnicianAssignedCard } from '../../components/client/TechnicianAssignedCard';
import { bookingService, Booking } from '../../services/bookings';
import { paymentService } from '../../services/payments';
import {
  formatBookingStatus,
  getTechnicianFromBooking,
} from '../../utils/bookingDisplay';
import { SparePartsSummary } from '../../components/common/SparePartsSummary';
import { Button } from '../../components/common/Button';
import { bookingHasSpareParts } from '../../utils/spareParts';
import {
  getDisplayExtraPartsAmount,
  getInvoiceBalanceDue,
  hasQuotedSpareParts,
  invoiceNeedsPayment,
  isExtraPartsOnlyPayment,
} from '../../utils/invoice';
import { navigateToBookingPayment } from '../../utils/navigatePayment';
import { formatINR } from '../../utils/payment';
import { formatBookingSchedule, getISTGreetingHour } from '../../utils/schedule';
import { COLORS } from '../../constants/colors';
import { Screen } from '../../components/common/Screen';
import { SafeScrollView } from '../../components/common/SafeScrollView';

interface Props {
  navigation: any;
}

const QuickActionItem = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <PressableScale onPress={onPress} style={styles.quickAction} scaleTo={0.92}>
    <View style={styles.quickActionIcon}>
      <Ionicons name={icon} size={20} color={COLORS.white} />
    </View>
    <Text style={styles.quickActionLabel} numberOfLines={2}>
      {label}
    </Text>
  </PressableScale>
);

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const user = useSelector((state: any) => state.auth.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [b, invoices] = await Promise.all([
        bookingService.getMyBookings({ limit: 20 }),
        paymentService.getMyInvoices(),
      ]);
      setBookings(b);
      setPendingCount(
        invoices.filter((i) => getInvoiceBalanceDue(i) > 0).length
      );
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const upcomingServices = bookings.filter(
    (b) => !['completed', 'cancelled'].includes(b.status)
  );

  const hour = getISTGreetingHour();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) return <LoadingView />;

  return (
    <Screen>
      <DashboardTopBar
        onNotificationsPress={() => navigation.navigate('Notifications')}
      />

      <SafeScrollView contentContainerStyle={styles.scroll}>
        <FadeIn index={1} style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingLabel}>{greeting},</Text>
            <Text style={styles.greetingName}>{user?.name || 'Client'}</Text>
          </View>
        </FadeIn>

        <FadeIn index={2} style={styles.statsRow}>
          <Card style={styles.statCard} padding={14}>
            <Text style={styles.statNum}>
              {bookings.filter((b) => !['completed', 'cancelled'].includes(b.status)).length}
            </Text>
            <Text style={styles.statLabel}>Upcoming{'\n'}Services</Text>
          </Card>
          <Card style={styles.statCard} padding={14}>
            <Text style={styles.statNum}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending{'\n'}Payment</Text>
          </Card>
          <Card style={styles.statCard} padding={14}>
            <Text style={styles.statNum}>
              {bookings.filter((b) => b.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed{'\n'}Services</Text>
          </Card>
        </FadeIn>

        <FadeIn index={3} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Services</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Services')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </FadeIn>

        <FadeIn index={4}>
          {upcomingServices.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {upcomingServices.map((item) => {
                const tech = getTechnicianFromBooking(item);
                return (
                  <Card key={item._id} style={styles.serviceCardHorizontal} padding={16}>
                    <Text style={styles.serviceType}>{item.serviceType}</Text>
                    <Text style={styles.serviceDetailValue}>
                      {item.venueId?.name ?? 'Venue'}
                    </Text>
                    <Text style={styles.serviceDate}>
                      {formatBookingSchedule(item.scheduledDate, item.scheduledTime)}
                    </Text>
                    <Badge
                      label={formatBookingStatus(item.status)}
                      variant="confirmed"
                    />
                    {tech ? (
                      <View style={styles.techInline}>
                        <Ionicons name="person-outline" size={14} color={COLORS.gray} />
                        <Text style={styles.techInlineText} numberOfLines={1}>
                          {tech.name}
                          {tech.phone ? ` · ${tech.phone}` : ''}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.awaitingTech}>Awaiting technician</Text>
                    )}
                    {bookingHasSpareParts(item) ? (
                      <SparePartsSummary
                        parts={item.spareParts}
                        compact={true}
                        showWithGst={!!item.invoice?.amountPaid}
                      />
                    ) : null}
                    {hasQuotedSpareParts(item.invoice, item.spareParts) ? (
                      <Text style={styles.extraDueLine}>
                        {isExtraPartsOnlyPayment(item.invoice, item.spareParts)
                          ? 'Extra parts due: '
                          : 'Extra parts (incl. GST): '}
                        {formatINR(
                          getDisplayExtraPartsAmount(
                            item.invoice,
                            item.spareParts
                          )
                        )}
                      </Text>
                    ) : null}
                    {invoiceNeedsPayment(item.invoice) ? (
                      <Button
                        label={
                          isExtraPartsOnlyPayment(item.invoice, item.spareParts)
                            ? 'PAY EXTRA PARTS'
                            : 'PAY NOW'
                        }
                        onPress={() => navigateToBookingPayment(navigation, item, item.invoice)}
                        style={styles.payBtn}
                      />
                    ) : null}
                    <TouchableOpacity
                      style={styles.detailsBtn}
                      onPress={() =>
                        navigation.navigate('TrackService', { id: item._id })
                      }
                    >
                      <Text style={styles.detailsBtnText}>TRACK</Text>
                    </TouchableOpacity>
                  </Card>
                );
              })}
            </ScrollView>
          ) : (
            <Card padding={16}>
              <Text style={styles.empty}>No upcoming services. Book one below.</Text>
            </Card>
          )}
        </FadeIn>

        <FadeIn index={5} style={styles.quickActionsSection}>
          <Text style={styles.sectionTitleInline}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionItem
              icon="calendar-outline"
              label="Book Service"
              onPress={() =>
                navigation.navigate('ServiceCategories', { reset: true })
              }
            />
            <QuickActionItem
              icon="hardware-chip-outline"
              label="General Service"
              onPress={() =>
                navigation.navigate('ServiceCategories', {
                  reset: true,
                  preselect: 'general-service',
                })
              }
            />
            <QuickActionItem
              icon="navigate-outline"
              label="General Visit"
              onPress={() =>
                navigation.navigate('ServiceCategories', {
                  reset: true,
                  preselect: 'general-visit',
                })
              }
            />
            <QuickActionItem
              icon="card-outline"
              label="Payment History"
              onPress={() => navigation.getParent()?.navigate('Payments')}
            />
          </View>
        </FadeIn>
      </SafeScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  extraDueLine: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: COLORS.red,
    marginTop: 8,
  },
  payBtn: {
    marginTop: 10,
    minHeight: 44,
  },
  scroll: { paddingHorizontal: 20 },
  greetingRow: { marginBottom: 24 },
  greetingLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: COLORS.gray,
  },
  greetingName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 30,
    color: COLORS.white,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: { flex: 1 },
  statNum: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
    color: COLORS.gray,
    lineHeight: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.white,
  },
  viewAll: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.red,
  },
  serviceCard: { marginBottom: 28 },
  horizontalList: { paddingBottom: 8, gap: 12 },
  serviceCardHorizontal: {
    width: 280,
    marginRight: 0,
  },
  serviceType: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  serviceDetailValue: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: COLORS.white,
    marginTop: 8,
  },
  serviceDate: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    color: COLORS.gray,
    marginVertical: 10,
  },
  techInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  techInlineText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    flex: 1,
  },
  awaitingTech: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.grayDark,
    marginTop: 12,
  },
  detailsBtn: {
    marginTop: 12,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    color: COLORS.red,
  },
  empty: { color: COLORS.gray, fontFamily: 'Montserrat_400Regular' },
  quickActionsSection: { marginBottom: 20 },
  sectionTitleInline: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 14,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickAction: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 15,
    width: '100%',
  },
});
