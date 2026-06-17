import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const defaultStackOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  animationDuration: 300,
  gestureEnabled: true,
  fullScreenGestureEnabled: true,
};

export const authStackOptions: NativeStackNavigationOptions = {
  ...defaultStackOptions,
  animation: 'fade_from_bottom',
  animationDuration: 340,
};

export const modalStackOptions: NativeStackNavigationOptions = {
  ...defaultStackOptions,
  animation: 'slide_from_bottom',
  presentation: 'modal',
};

export const rootStackOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  animationDuration: 380,
};
