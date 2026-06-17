import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { Header } from '../../components/common/Header';
import { SafeScrollView } from '../../components/common/SafeScrollView';
import { useLayoutInsets } from '../../hooks/useLayoutInsets';
import { LoadingView } from '../../components/common/LoadingView';
import { PressableScale } from '../../components/common/PressableScale';
import { adminService } from '../../services/admin';
import { COLORS } from '../../constants/colors';

type UserRole = 'client' | 'technician' | 'admin';

interface UserRow {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
}

const CATEGORIES: {
  role: UserRole;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
}[] = [
  {
    role: 'client',
    title: 'Users',
    subtitle: 'Clients & service accounts',
    icon: 'people-outline',
    accent: COLORS.red,
  },
  {
    role: 'technician',
    title: 'Technicians',
    subtitle: 'Field engineers & assignees',
    icon: 'hardware-chip-outline',
    accent: '#4a9eff',
  },
  {
    role: 'admin',
    title: 'Admins',
    subtitle: 'Operations & dashboard access',
    icon: 'shield-outline',
    accent: '#c9a227',
  },
];

const categoryMeta = (role: UserRole) =>
  CATEGORIES.find((c) => c.role === role)!;

export const AdminUsersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { scrollBottomPadding } = useLayoutInsets();
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!activeRole) return;
    setLoading(true);
    try {
      const q = search.trim();
      setUsers(
        await adminService.getUsers({
          role: activeRole,
          search: q || undefined,
          limit: 100,
        })
      );
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [activeRole, search]);

  useEffect(() => {
    if (!activeRole) return;
    const timer = setTimeout(load, search.trim() ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, activeRole, search]);

  const openCategory = (role: UserRole) => {
    setSearch('');
    setUsers([]);
    setActiveRole(role);
  };

  const closeList = () => {
    setActiveRole(null);
    setSearch('');
    setUsers([]);
  };

  const goBackFromHub = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const parent = navigation.getParent();
    if (parent?.canGoBack?.()) {
      parent.goBack();
      return;
    }
    parent?.navigate('Dashboard');
  }, [navigation]);

  const toggle = async (id: string) => {
    try {
      await adminService.toggleUser(id);
      load();
    } catch (e: any) {
      Alert.alert('Failed', e.message);
    }
  };

  if (!activeRole) {
    return (
      <Screen>
        <Header title="Users" showBack onBackPress={goBackFromHub} />
        <SafeScrollView contentContainerStyle={styles.hub}>
          <Text style={styles.hubTitle}>Manage accounts</Text>
          <Text style={styles.hubDesc}>
            Choose a role group to browse, search, and enable or disable accounts.
          </Text>
          {CATEGORIES.map((cat) => (
            <PressableScale
              key={cat.role}
              style={[styles.categoryBtn, { borderColor: `${cat.accent}45` }]}
              onPress={() => openCategory(cat.role)}
            >
              <View
                style={[styles.categoryIcon, { backgroundColor: `${cat.accent}18` }]}
              >
                <Ionicons name={cat.icon} size={22} color={cat.accent} />
              </View>
              <View style={styles.categoryText}>
                <Text style={styles.categoryTitle}>{cat.title}</Text>
                <Text style={styles.categorySubtitle}>{cat.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.grayDark} />
            </PressableScale>
          ))}
        </SafeScrollView>
      </Screen>
    );
  }

  const meta = categoryMeta(activeRole);

  return (
    <Screen>
      <Header
        title={meta.title}
        showBack
        onBackPress={closeList}
      />
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={16} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${meta.title.toLowerCase()}…`}
          placeholderTextColor={COLORS.grayDark}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      {loading && users.length === 0 ? (
        <LoadingView />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => u._id}
          contentContainerStyle={[styles.list, { paddingBottom: scrollBottomPadding }]}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.empty}>
              {search.trim()
                ? `No ${meta.title.toLowerCase()} match your search.`
                : `No ${meta.title.toLowerCase()} found.`}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                {item.phone ? (
                  <Text style={styles.phone}>{item.phone}</Text>
                ) : null}
                <View
                  style={[
                    styles.statusPill,
                    item.isActive ? styles.statusActive : styles.statusInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.isActive ? styles.statusTextActive : styles.statusTextInactive,
                    ]}
                  >
                    {item.isActive ? 'ACTIVE' : 'DISABLED'}
                  </Text>
                </View>
              </View>
              <Switch
                value={item.isActive}
                onValueChange={() => toggle(item._id)}
                trackColor={{ true: COLORS.red }}
              />
            </View>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  hub: { padding: 20, paddingTop: 8 },
  hubTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: COLORS.white,
    marginBottom: 8,
  },
  hubDesc: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 24,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: { flex: 1 },
  categoryTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
  categorySubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: COLORS.white,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  info: { flex: 1, paddingRight: 12 },
  name: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  email: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  phone: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.grayDark,
    marginTop: 2,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  statusActive: { backgroundColor: COLORS.statusConfirmedBg },
  statusInactive: { backgroundColor: 'rgba(255,255,255,0.06)' },
  statusText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 8,
    letterSpacing: 1,
  },
  statusTextActive: { color: COLORS.statusConfirmed },
  statusTextInactive: { color: COLORS.grayDark },
  empty: {
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
  },
});
