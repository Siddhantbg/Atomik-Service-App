import { CommonActions } from '@react-navigation/native';

type UserRole = 'client' | 'technician' | 'admin';

/** Open the booking related to a notification — route depends on user role. */
export function navigateToBookingFromNotification(
  navigation: { dispatch: (action: ReturnType<typeof CommonActions.navigate>) => void; navigate: (...args: any[]) => void },
  role: UserRole | string | undefined,
  bookingId: string
): void {
  const id = String(bookingId);

  if (role === 'technician') {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Jobs',
        params: {
          screen: 'JobDetail',
          params: { jobId: id },
        },
      })
    );
    return;
  }

  if (role === 'admin') {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Dashboard',
        params: {
          screen: 'AdminBookingDetail',
          params: { bookingId: id },
        },
      })
    );
    return;
  }

  // Client — TrackService lives in Home stack
  navigation.dispatch(
    CommonActions.navigate({
      name: 'Home',
      params: {
        screen: 'TrackService',
        params: { id },
      },
    })
  );
}
