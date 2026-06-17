import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

type BadgeVariant = 'confirmed' | 'pending' | 'ongoing' | 'completed' | 'new' | 'due';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  confirmed: {
    bg: COLORS.statusConfirmedBg,
    text: '#4caf7d',
    border: 'rgba(76, 175, 125, 0.3)',
  },
  pending: {
    bg: COLORS.statusPendingBg,
    text: '#d4a017',
    border: 'rgba(212, 160, 23, 0.3)',
  },
  ongoing: {
    bg: COLORS.statusOngoingBg,
    text: '#4a9edd',
    border: 'rgba(74, 158, 221, 0.3)',
  },
  completed: {
    bg: COLORS.statusCompletedBg,
    text: '#4caf7d',
    border: 'rgba(76, 175, 125, 0.3)',
  },
  new: {
    bg: 'rgba(237, 29, 36, 0.15)',
    text: COLORS.red,
    border: 'rgba(237, 29, 36, 0.3)',
  },
  due: {
    bg: 'rgba(237, 29, 36, 0.1)',
    text: COLORS.red,
    border: 'rgba(237, 29, 36, 0.25)',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'pending',
  style,
}) => {
  const vs = variantStyles[variant];
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: vs.bg,
          borderColor: vs.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: vs.text }]}>{label.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    letterSpacing: 1,
  },
});
