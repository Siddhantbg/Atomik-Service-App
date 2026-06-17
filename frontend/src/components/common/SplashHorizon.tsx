import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');

type Dot = { x: number; y: number; r: number; o: number };

/** Perspective dotted horizon + upper “spectrum” — matches brand landing mockup */
export const SplashHorizon: React.FC<{
  height?: number;
  animate?: boolean;
}> = ({ height = Math.round(SCREEN_W * 0.52), animate = true }) => {
  const w = SCREEN_W;
  const h = height;
  const cx = w / 2;
  const pulse = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 8000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();
    driftLoop.start();
    return () => {
      glowLoop.stop();
      driftLoop.stop();
    };
  }, [animate, pulse, drift]);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });
  const driftY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  const { mountain, rings, glow } = useMemo(() => {
    const mountainDots: Dot[] = [];
    const cols = 22;
    const baseY = h * 0.06;
    const peakY = h * 0.28;
    for (let c = 0; c < cols; c++) {
      const t = c / (cols - 1);
      const envelope = Math.sin(t * Math.PI);
      const rows = Math.max(2, Math.round(envelope * 14));
      for (let r = 0; r < rows; r++) {
        const y = peakY + (baseY - peakY) * (r / rows) + (1 - envelope) * 8;
        const x = cx + (t - 0.5) * w * 0.78;
        mountainDots.push({
          x,
          y,
          r: 1.1,
          o: 0.12 + envelope * 0.35 + (1 - r / rows) * 0.15,
        });
      }
    }

    const ringDots: Dot[] = [];
    const horizonY = h * 0.9;
    const ringCount = 14;
    for (let ring = 0; ring < ringCount; ring++) {
      const t = ring / (ringCount - 1);
      const rx = 28 + ring * (w * 0.038);
      const ry = 6 + ring * 2.2;
      const count = 10 + ring * 2;
      for (let i = 0; i < count; i++) {
        const u = i / (count - 1);
        const angle = Math.PI + u * Math.PI;
        const x = cx + Math.cos(angle) * rx;
        const y = horizonY + Math.sin(angle) * ry;
        const centerBoost = 1 - Math.abs(u - 0.5) * 1.6;
        ringDots.push({
          x,
          y,
          r: Math.max(0.65, 1.45 - t * 0.55),
          o: Math.min(0.85, 0.08 + (1 - t) * 0.45 + centerBoost * 0.35),
        });
      }
    }

    return {
      mountain: mountainDots,
      rings: ringDots,
      glow: { cx, cy: horizonY - 2, r: w * 0.22 },
    };
  }, [w, h, cx]);

  return (
    <Animated.View
      style={[
        styles.wrap,
        { height: h, transform: [{ translateY: driftY }] },
      ]}
      pointerEvents="none"
    >
      <Svg width={w} height={h}>
        <Defs>
          <RadialGradient id="horizonGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <Stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {mountain.map((d, i) => (
          <Circle
            key={`m-${i}`}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="#ffffff"
            opacity={d.o}
          />
        ))}
        {rings.map((d, i) => (
          <Circle
            key={`r-${i}`}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="#ffffff"
            opacity={d.o}
          />
        ))}
      </Svg>
      <Animated.View
        style={[
          styles.glowOverlay,
          {
            left: glow.cx - glow.r,
            top: glow.cy - glow.r,
            width: glow.r * 2,
            height: glow.r * 2,
            borderRadius: glow.r,
            opacity: glowOpacity,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: SCREEN_W,
    alignSelf: 'center',
  },
  glowOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
