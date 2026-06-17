import { Easing } from 'react-native';

/** Premium ease — Tesla / Linear style */
export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.45, 0, 0.15, 1);

export const DURATION = {
  fast: 220,
  normal: 420,
  slow: 680,
} as const;

/** Stagger delay per list / section index */
export const stagger = (index: number, step = 70) => index * step;
