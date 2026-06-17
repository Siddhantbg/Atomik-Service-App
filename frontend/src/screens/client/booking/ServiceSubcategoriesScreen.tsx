import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingFlowHeader } from '../../../components/booking/BookingFlowHeader';
import {
  EXTRA_PARTS_CHARGE_NOTE,
  GENERAL_SERVICE_ITEMS,
} from '../../../constants/audioServices';
import { useBookingDraft } from '../../../context/BookingDraftContext';
import { COLORS } from '../../../constants/colors';

interface Props {
  navigation: any;
}

export const ServiceSubcategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const { draft, addCategory, removeCategory } = useBookingDraft();
  const [selected, setSelected] = useState<string[]>(
    draft.categoryIds.filter((id) =>
      GENERAL_SERVICE_ITEMS.some((s) => s.id === id)
    )
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const continueFlow = () => {
    GENERAL_SERVICE_ITEMS.forEach((s) => removeCategory(s.id));
    selected.forEach((id) => addCategory(id));
    navigation.navigate('PlaceOrder');
  };

  return (
    <View style={styles.container}>
      <BookingFlowHeader
        title="General Service"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>EQUIPMENT MODULES</Text>
        <Text style={styles.hint}>
          Select one or more services for your booking.
        </Text>

        {GENERAL_SERVICE_ITEMS.map((item) => {
          const active = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.row, active && styles.rowActive]}
              onPress={() => toggle(item.id)}
              activeOpacity={0.85}
            >
              <View
                style={[styles.rowIcon, active && styles.rowIconActive]}
              >
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={active ? COLORS.red : COLORS.gray}
                />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.label}</Text>
                <Text style={styles.rowDesc}>{item.description}</Text>
                <View style={styles.rowMeta}>
                  <Text style={styles.rowDuration}>{item.duration}</Text>
                  <Text style={styles.rowDot}>·</Text>
                  <Text style={styles.rowPrice}>{item.basePrice}</Text>
                </View>
              </View>
              <View
                style={[styles.check, active && styles.checkActive]}
              >
                {active && (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.chargeNote}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.gray}
            style={styles.chargeNoteIcon}
          />
          <Text style={styles.chargeNoteText}>{EXTRA_PARTS_CHARGE_NOTE}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, selected.length === 0 && styles.disabled]}
          disabled={selected.length === 0}
          onPress={continueFlow}
        >
          <Text
            style={[
              styles.continueText,
              selected.length === 0 && styles.continueTextDisabled,
            ]}
          >
            CONTINUE{selected.length > 0 ? ` (${selected.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 100 },
  sectionLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: COLORS.grayDark,
    letterSpacing: 2,
    marginBottom: 6,
  },
  hint: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  rowActive: {
    borderColor: COLORS.borderActive,
    backgroundColor: 'rgba(237, 29, 36, 0.06)',
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconActive: {
    backgroundColor: COLORS.redMuted,
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 3,
  },
  rowDesc: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.gray,
    lineHeight: 15,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  rowDuration: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: COLORS.grayDark,
  },
  rowDot: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: COLORS.grayDark,
  },
  rowPrice: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: COLORS.red,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.grayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueBtn: {
    height: 52,
    backgroundColor: COLORS.red,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: COLORS.surface,
  },
  continueText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: COLORS.white,
    letterSpacing: 2,
  },
  continueTextDisabled: {
    color: COLORS.grayDark,
  },
  chargeNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  chargeNoteIcon: {
    marginTop: 1,
  },
  chargeNoteText: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.gray,
    lineHeight: 17,
  },
});
