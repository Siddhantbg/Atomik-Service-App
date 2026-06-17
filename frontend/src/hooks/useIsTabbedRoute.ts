import { useNavigationState } from '@react-navigation/native';

/** True when the screen lives under a bottom tab navigator (tab bar visible). */
export function useIsTabbedRoute(): boolean {
  return useNavigationState((state) => {
    let current = state;
    while (current) {
      if (current.type === 'tab') return true;
      const index = current.index ?? 0;
      const route = current.routes[index];
      if (!route?.state) break;
      current = route.state as typeof state;
    }
    return false;
  });
}
