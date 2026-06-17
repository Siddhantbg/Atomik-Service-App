import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Header } from '../../components/common/Header';
import { LoadingView } from '../../components/common/LoadingView';
import { venueService, Venue } from '../../services/venues';
import { COLORS } from '../../constants/colors';

export const AdminVenuesScreen: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setVenues(await venueService.getAllVenues());
    } catch {
      setVenues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingView />;

  return (
    <View style={styles.container}>
      <Header showBack title="Venues" />
      <FlatList
        data={venues}
        keyExtractor={(v) => v._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No venues.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.area}>
              {item.area}, {item.city}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 20 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  name: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  area: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  empty: {
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 40,
  },
});
