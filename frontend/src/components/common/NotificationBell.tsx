import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import { COLORS } from '../../constants/colors';

interface Props {
  onPress: () => void;
  size?: number;
}

export const NotificationBell: React.FC<Props> = ({ onPress, size = 24 }) => {
  const hit = Math.max(44, size + 16);
  const glowSize = Math.round(size * 1.45);
  const glowInset = (hit - glowSize) / 2;
  const badgeInset = Math.max(2, (hit - size) / 2 - 6);

  const { unreadCount } = useUnreadNotifications();
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (unreadCount <= 0) {
      pulse.setValue(1);
      glow.setValue(0.4);
      return;
    }
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.35,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [unreadCount, pulse, glow]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.wrap, { width: hit, height: hit }]}
      hitSlop={8}
      activeOpacity={0.8}
    >
      {unreadCount > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              width: glowSize,
              height: glowSize,
              borderRadius: glowSize / 2,
              top: glowInset,
              left: glowInset,
              opacity: glow,
            },
          ]}
        />
      ) : null}
      <Animated.View
        style={[styles.iconCenter, { transform: [{ scale: pulse }] }]}
      >
        <Ionicons
          name={unreadCount > 0 ? 'notifications' : 'notifications-outline'}
          size={size}
          color={unreadCount > 0 ? COLORS.red : COLORS.white}
        />
      </Animated.View>
      {unreadCount > 0 ? (
        <View
          style={[
            styles.badge,
            { top: badgeInset, right: badgeInset },
          ]}
        >
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: COLORS.red,
  },
  iconCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  badgeText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 8,
    color: COLORS.white,
    fontWeight: '700',
  },
});
