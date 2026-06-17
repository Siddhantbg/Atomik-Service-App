import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AccountScreenLayout } from '../../../components/common/AccountScreenLayout';
import { Card } from '../../../components/common/Card';
import { LoadingView } from '../../../components/common/LoadingView';
import { venueService, Venue } from '../../../services/venues';
import { COLORS } from '../../../constants/colors';

export const SavedVenuesScreen: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      venueService
        .getMyVenues()
        .then(setVenues)
        .catch(() => setVenues([]))
        .finally(() => setLoading(false));
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <LoadingView />
      </View>
    );
  }

  return (
    <AccountScreenLayout title="Saved Venues">
      {venues.length === 0 ? (
        <Text style={styles.empty}>No saved venues yet. Add one when booking a service.</Text>
      ) : (
        venues.map((v) => (
          <Card key={v._id} padding={16} style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="location-outline" size={20} color={COLORS.red} />
              <View style={styles.body}>
                <Text style={styles.name}>{v.name}</Text>
                <Text style={styles.line}>
                  {[v.address, v.area, v.city, v.pincode].filter(Boolean).join(', ')}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}
    </AccountScreenLayout>
  );
};

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, backgroundColor: COLORS.background },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  body: { flex: 1 },
  name: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.white,
  },
  line: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 6,
    lineHeight: 18,
  },
  empty: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 24,
  },
});
