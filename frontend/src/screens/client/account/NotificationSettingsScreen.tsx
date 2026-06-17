import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountScreenLayout } from '../../../components/common/AccountScreenLayout';
import { Card } from '../../../components/common/Card';
import { COLORS } from '../../../constants/colors';

const STORAGE_KEY = 'atomik_notification_prefs';

export const NotificationSettingsScreen: React.FC = () => {
  const [booking, setBooking] = useState(true);
  const [payment, setPayment] = useState(true);
  const [promo, setPromo] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      try {
        const prefs = JSON.parse(raw);
        setBooking(prefs.booking ?? true);
        setPayment(prefs.payment ?? true);
        setPromo(prefs.promo ?? false);
      } catch {
        /* ignore */
      }
    });
  }, []);

  const persist = async (next: { booking: boolean; payment: boolean; promo: boolean }) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    Alert.alert('Saved', 'Notification preferences updated.');
  };

  const toggle = (
    key: 'booking' | 'payment' | 'promo',
    value: boolean,
    setter: (v: boolean) => void
  ) => {
    setter(value);
    const next = {
      booking: key === 'booking' ? value : booking,
      payment: key === 'payment' ? value : payment,
      promo: key === 'promo' ? value : promo,
    };
    persist(next);
  };

  return (
    <AccountScreenLayout title="Notifications">
      <Card padding={0}>
        <Row
          label="Booking updates"
          desc="Technician assigned, en route, completed"
          value={booking}
          onValueChange={(v) => toggle('booking', v, setBooking)}
        />
        <Divider />
        <Row
          label="Payment alerts"
          desc="Invoices and payment confirmations"
          value={payment}
          onValueChange={(v) => toggle('payment', v, setPayment)}
        />
        <Divider />
        <Row
          label="Offers & tips"
          desc="Product updates and maintenance tips"
          value={promo}
          onValueChange={(v) => toggle('promo', v, setPromo)}
        />
      </Card>
    </AccountScreenLayout>
  );
};

const Row: React.FC<{
  label: string;
  desc: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}> = ({ label, desc, value, onValueChange }) => (
  <View style={styles.row}>
    <View style={styles.rowText}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.grayDark, true: COLORS.red }}
      thumbColor={COLORS.white}
    />
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  rowText: { flex: 1 },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  desc: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: 16,
  },
});
