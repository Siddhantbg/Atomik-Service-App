import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  optional?: boolean;
  onPress: () => void;
}

export const OrderActionRow: React.FC<Props> = ({
  icon,
  label,
  value,
  optional,
  onPress,
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={20} color={COLORS.red} />
    </View>
    <View style={styles.textWrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && <Text style={styles.optionalTag}>Optional</Text>}
      </View>
      {value ? (
        <Text style={styles.value} numberOfLines={2}>
          {value}
        </Text>
      ) : optional ? (
        <Text style={styles.optionalHint}>Not required to place order</Text>
      ) : null}
    </View>
    <Ionicons name="chevron-forward" size={18} color={COLORS.grayDark} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: COLORS.redMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  optionalTag: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 8,
    color: COLORS.grayDark,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 3,
  },
  optionalHint: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.grayDark,
    marginTop: 4,
  },
  value: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 4,
    lineHeight: 14,
  },
});
