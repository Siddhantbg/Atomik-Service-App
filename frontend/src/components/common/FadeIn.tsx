import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { DURATION, EASE_OUT, stagger } from '../../utils/motion';

interface FadeInProps {
  children: React.ReactNode;
  /** Auto-stagger when used in lists */
  index?: number;
  delay?: number;
  fromY?: number;
  fromX?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  index = 0,
  delay = 0,
  fromY = 22,
  fromX = 0,
  duration = DURATION.normal,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(fromY)).current;
  const translateX = useRef(new Animated.Value(fromX)).current;

  useEffect(() => {
    const d = delay + stagger(index);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay: d,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: d,
        friction: 9,
        tension: 68,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        delay: d,
        friction: 9,
        tension: 68,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration, index, opacity, translateX, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
