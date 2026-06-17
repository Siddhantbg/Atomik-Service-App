import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingView } from '../../components/common/LoadingView';
import { PaymentBreakdownCard } from '../../components/common/PaymentBreakdownCard';
import { SparePartsSummary } from '../../components/common/SparePartsSummary';
import { bookingHasSpareParts } from '../../utils/spareParts';
import { bookingService, Booking } from '../../services/bookings';
import { adminService } from '../../services/admin';
import { COLORS } from '../../constants/colors';

interface Props {
  navigation: any;
  route: { params: { bookingId: string } };
}

export const AdminBookingDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [technicians, setTechnicians] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const load = useCallback(async () => {
    try {
      const [b, users] = await Promise.all([
        bookingService.getBookingById(bookingId),
        adminService.getUsers({ role: 'technician' }),
      ]);
      setBooking(b);
      setTechnicians(users);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    load();
  }, [load]);

  const assign = async (technicianId: string) => {
    setAssigning(true);
    try {
      await bookingService.assignTechnician(bookingId, technicianId);
      Alert.alert('Assigned', 'Technician assigned successfully.');
      load();
    } catch (e: any) {
      Alert.alert('Failed', e.message);
    } finally {
      setAssigning(false);
    }
  };

  const cancel = () => {
    Alert.alert('Cancel booking?', 'This cannot be undone.', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: async () => {
          try {
            await bookingService.cancelBooking(bookingId, 'Cancelled by admin');
            Alert.alert('Cancelled');
            navigation.goBack();
          } catch (e: any) {
            Alert.alert('Failed', e.message);
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingView />;
  if (!booking) return null;

  return (
    <View style={styles.container}>
      <Header showBack title={`#${booking.bookingId}`} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card padding={18}>
          <Text style={styles.title}>{booking.serviceType}</Text>
          <Text style={styles.line}>Status: {booking.status}</Text>
          <Text style={styles.line}>Venue: {booking.venueId?.name}</Text>
          <Text style={styles.line}>
            Client: {(booking.clientId as any)?.name ?? '—'}
          </Text>
          <Text style={styles.line}>
            Technician: {(booking.technicianId as any)?.name ?? 'Unassigned'}
          </Text>
        </Card>
        {bookingHasSpareParts(booking) ? (
          <Card padding={16}>
            <SparePartsSummary parts={booking.spareParts} />
          </Card>
        ) : null}
        {booking.invoice ? (
          <PaymentBreakdownCard invoice={booking.invoice} />
        ) : (
          <Card padding={18}>
            <Text style={styles.line}>No invoice linked to this booking.</Text>
          </Card>
        )}
        <Text style={styles.section}>Assign technician</Text>
        {technicians.map((t) => (
          <Button
            key={t._id}
            label={`Assign ${t.name}`}
            onPress={() => assign(t._id)}
            loading={assigning}
            variant="outline"
          />
        ))}
        {technicians.length === 0 && (
          <Text style={styles.empty}>No technicians in system.</Text>
        )}
        <Button label="CANCEL BOOKING" onPress={cancel} variant="outline" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20 },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.white,
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  line: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  section: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
    marginTop: 24,
    marginBottom: 12,
  },
  empty: { color: COLORS.gray, marginBottom: 16 },
});
