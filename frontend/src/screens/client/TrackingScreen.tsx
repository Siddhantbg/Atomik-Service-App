import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { LoadingView } from '../../components/common/LoadingView';
import { ErrorView } from '../../components/common/ErrorView';
import { TechnicianAssignedCard } from '../../components/client/TechnicianAssignedCard';
import { bookingService, Booking } from '../../services/bookings';
import {
  formatBookingStatus,
  getTechnicianFromBooking,
} from '../../utils/bookingDisplay';
import { formatBookingSchedule } from '../../utils/schedule';
import { ExtraPartsPaymentCard } from '../../components/client/ExtraPartsPaymentCard';
import { SparePartsSummary } from '../../components/common/SparePartsSummary';
import { PaymentBreakdownCard } from '../../components/common/PaymentBreakdownCard';
import { bookingHasSpareParts } from '../../utils/spareParts';
import { invoiceNeedsPayment, isExtraPartsOnlyPayment } from '../../utils/invoice';
import { navigateToBookingPayment } from '../../utils/navigatePayment';
import { TrackingTimeline } from '../../components/client/TrackingTimeline';
import {
  buildTrackingTimeline,
  trackingBadgeVariant,
} from '../../utils/trackingTimeline';
import { COLORS } from '../../constants/colors';

const POLL_MS = 12_000;

interface Props {
  navigation: any;
  route: { params: { id: string } };
}

export const TrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      if (!silent) setError('');
      try {
        const b = await bookingService.getBookingById(id);
        setBooking(b);
      } catch (e: any) {
        if (!silent) setError(e.message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [id]
  );

  useFocusEffect(
    useCallback(() => {
      load(false);
      pollRef.current = setInterval(() => load(true), POLL_MS);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }, [load])
  );

  if (loading && !booking) return <LoadingView />;
  if (error && !booking) return <ErrorView message={error} onRetry={() => load(false)} />;
  if (!booking) return null;

  const timeline = buildTrackingTimeline(booking);
  const technician = getTechnicianFromBooking(booking);
  const statusLabel = formatBookingStatus(booking.status);
  const needsPay = invoiceNeedsPayment(booking.invoice);
  const hasSpare = bookingHasSpareParts(booking);
  const extraPartsOnly = isExtraPartsOnlyPayment(
    booking.invoice,
    booking.spareParts
  );
  const pay = () => navigateToBookingPayment(navigation, booking, booking.invoice);

  return (
    <View style={styles.container}>
      <Header showBack showLogo />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card padding={18}>
          <Text style={styles.title}>{booking.serviceType}</Text>
          <Text style={styles.meta}>#{booking.bookingId}</Text>
          <Text style={styles.meta}>{booking.venueId?.name}</Text>
          <Text style={styles.meta}>
            {formatBookingSchedule(booking.scheduledDate, booking.scheduledTime)}
          </Text>
          <Badge
            label={statusLabel}
            variant={trackingBadgeVariant(booking.status)}
          />
        </Card>

        {technician ? (
          <TechnicianAssignedCard
            name={technician.name}
            phone={technician.phone}
            statusLabel={statusLabel}
          />
        ) : (
          <Card padding={16} style={styles.waitingCard}>
            <Text style={styles.waitingTitle}>Technician not assigned yet</Text>
            <Text style={styles.waitingBody}>
              You will see your technician&apos;s name and contact here once
              someone accepts the job.
            </Text>
          </Card>
        )}

        {hasSpare && needsPay && extraPartsOnly ? (
          <ExtraPartsPaymentCard
            parts={booking.spareParts}
            invoice={booking.invoice}
            onPay={pay}
          />
        ) : hasSpare ? (
          <Card padding={16} style={styles.partsCard}>
            <SparePartsSummary
              parts={booking.spareParts}
              showWithGst={!!booking.invoice?.amountPaid}
            />
          </Card>
        ) : null}

        {booking.invoice ? (
          <PaymentBreakdownCard
            invoice={booking.invoice}
            sparePartsLines={booking.spareParts}
            onPayPress={needsPay && !extraPartsOnly ? pay : undefined}
          />
        ) : null}

        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTitle}>Live updates</Text>
          <Text style={styles.timelineHint}>Refreshes automatically</Text>
        </View>
        <TrackingTimeline events={timeline} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  meta: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 6,
  },
  partsCard: {
    marginTop: 16,
  },
  waitingCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  waitingTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  waitingBody: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 8,
    lineHeight: 18,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  timelineTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  timelineHint: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
    color: COLORS.grayDark,
    fontStyle: 'italic',
  },
});
