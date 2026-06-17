import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

interface Props {
  accent?: string;
}

/** Rack-style grid + animated signal bars */
export const IndustrialDecor: React.FC<Props> = ({ accent = COLORS.red }) => {
  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.25,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`v${i}`}
          style={[
            styles.gridLineV,
            { left: (width / 8) * i, borderColor: `${accent}12` },
          ]}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={`h${i}`}
          style={[styles.gridLineH, { top: 48 * i, borderColor: `${accent}0a` }]}
        />
      ))}
      <View style={styles.meterRow}>
        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.45, 0.75, 0.55, 0.85].map((h, i) => (
          <Animated.View
            key={i}
            style={[
              styles.meterBar,
              {
                height: 12 + h * 28,
                backgroundColor: accent,
                opacity: pulse,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    borderLeftWidth: 1,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
  },
  meterRow: {
    position: 'absolute',
    right: 20,
    top: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    opacity: 0.35,
  },
  meterBar: {
    width: 3,
    borderRadius: 1,
  },
});
