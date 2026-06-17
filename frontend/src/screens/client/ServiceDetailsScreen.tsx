import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingView } from '../../components/common/LoadingView';
import { ErrorView } from '../../components/common/ErrorView';
import { TechnicianAssignedCard } from '../../components/client/TechnicianAssignedCard';
import { bookingService, Booking } from '../../services/bookings';
import { paymentService, Invoice } from '../../services/payments';
import {
  formatBookingStatus,
  getTechnicianFromBooking,
} from '../../utils/bookingDisplay';
import { SparePartsSummary } from '../../components/common/SparePartsSummary';
import { bookingHasSpareParts } from '../../utils/spareParts';
import {
  invoiceNeedsPayment,
  getInvoiceBalanceDue,
  isExtraPartsOnlyPayment,
} from '../../utils/invoice';
import { navigateToBookingPayment } from '../../utils/navigatePayment';
import { COLORS } from '../../constants/colors';

interface Props {
  navigation: any;
  route: { params: { id: string } };
}

const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const ServiceDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const b = await bookingService.getBookingById(id);
      setBooking(b);
      const invoices = await paymentService.getMyInvoices();
      const inv = invoices.find((i) => {
        const bid = typeof i.bookingId === 'object' ? i.bookingId._id : i.bookingId;
        return bid === b._id;
      });
      setInvoice(inv ?? null);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) return <LoadingView />;
  if (error || !booking) return <ErrorView message={error} onRetry={load} />;

  const technician = getTechnicianFromBooking(booking);

  return (
    <View style={styles.container}>
      <Header showBack title="Service Details" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card padding={18}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.value}>{booking.bookingId}</Text>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{booking.serviceType}</Text>
          <Text style={styles.label}>Venue</Text>
          <Text style={styles.value}>{booking.venueId?.name ?? '—'}</Text>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{formatBookingStatus(booking.status)}</Text>
        </Card>

        {technician ? (
          <TechnicianAssignedCard
            name={technician.name}
            phone={technician.phone}
            statusLabel={formatBookingStatus(booking.status)}
          />
        ) : null}

        {bookingHasSpareParts(booking) ? (
          <Card padding={16} style={{ marginTop: 16 }}>
            <SparePartsSummary
              parts={booking.spareParts}
              showWithGst={!!booking.invoice?.amountPaid}
            />
          </Card>
        ) : null}

        {invoice && (
          <Card style={styles.invoiceCard} padding={18}>
            <Text style={styles.billTitle}>Invoice {invoice.invoiceNumber}</Text>
            {invoice.spareParts > 0 ? (
              <View style={styles.row}>
                <Text style={styles.muted}>Extra parts</Text>
                <Text style={styles.value}>{formatINR(invoice.spareParts)}</Text>
              </View>
            ) : null}
            <View style={styles.row}>
              <Text style={styles.muted}>Total</Text>
              <Text style={styles.total}>{formatINR(invoice.totalAmount)}</Text>
            </View>
            {invoiceNeedsPayment(invoice) ? (
              <View style={styles.row}>
                <Text style={styles.muted}>Balance due</Text>
                <Text style={styles.due}>{formatINR(getInvoiceBalanceDue(invoice))}</Text>
              </View>
            ) : null}
            <Text style={styles.muted}>Status: {invoice.status}</Text>
          </Card>
        )}

        <Button
          label="TRACK SERVICE"
          onPress={() => navigation.navigate('TrackService', { id: booking._id })}
          style={{ marginTop: 16 }}
        />
        {invoice && invoiceNeedsPayment(invoice) && (
          <Button
            label={
              isExtraPartsOnlyPayment(invoice, booking.spareParts)
                ? 'PAY EXTRA PARTS'
                : 'PAY NOW'
            }
            onPress={() => navigateToBookingPayment(navigation, booking, invoice)}
            style={{ marginTop: 10 }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 40 },
  label: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 10,
  },
  value: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  invoiceCard: { marginTop: 16 },
  billTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  muted: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: COLORS.gray },
  total: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.white },
  value: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.white },
  due: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.red },
});
