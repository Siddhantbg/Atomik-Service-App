import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { Header } from '../../components/common/Header';
import { useLayoutInsets } from '../../hooks/useLayoutInsets';
import { Badge } from '../../components/common/Badge';
import { LoadingView } from '../../components/common/LoadingView';
import { bookingService, Booking } from '../../services/bookings';
import { COLORS } from '../../constants/colors';
import { formatINR, paymentBadgeVariant, paymentLabel } from '../../utils/payment';

interface Props {
  navigation: any;
  route?: { params?: { status?: string } };
}

export const AdminBookingsScreen: React.FC<Props> = ({ navigation, route }) => {
  const statusFilter = route?.params?.status;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const list = await bookingService.getAllBookings({
        status: statusFilter,
        limit: 50,
      });
      setBookings(list);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const { scrollBottomPadding } = useLayoutInsets();

  if (loading) return <LoadingView />;

  return (
    <Screen>
      <Header title="All Bookings" />
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[styles.list, { paddingBottom: scrollBottomPadding }]}
        ListEmptyComponent={
          <Text style={styles.empty}>No bookings found.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('AdminBookingDetail', { bookingId: item._id })
            }
          >
            <View style={styles.row}>
              <Text style={styles.type}>{item.serviceType}</Text>
              <View style={styles.badges}>
                {item.paymentStatus ? (
                  <Badge
                    label={paymentLabel(item.paymentStatus)}
                    variant={paymentBadgeVariant(item.paymentStatus)}
                    style={styles.payBadge}
                  />
                ) : null}
                <Badge label={item.status} variant="ongoing" />
              </View>
            </View>
            <Text style={styles.meta}>#{item.bookingId}</Text>
            <Text style={styles.venue}>{item.venueId?.name}</Text>
            {item.invoice ? (
              <Text style={styles.amount}>
                {item.paymentStatus === 'paid'
                  ? `Received ${formatINR(item.invoice.amountPaid)}`
                  : `Due ${formatINR(item.invoice.totalAmount)}`}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: { padding: 20 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  payBadge: { marginRight: 0 },
  type: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  meta: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: COLORS.grayDark,
  },
  venue: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  amount: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.white,
    marginTop: 8,
  },
  empty: {
    color: COLORS.gray,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    marginTop: 40,
  },
});
