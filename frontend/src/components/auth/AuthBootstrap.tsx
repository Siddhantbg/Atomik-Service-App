import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { sessionRestoreFailed, restoreSession, logout } from '../../store/authSlice';
import { setUnauthorizedHandler } from '../../services/api';
import { purgeDemoSessionToken } from '../../services/tokenStore';
import { authService } from '../../services/auth';
import { warmupApi } from '../../services/apiWarmup';
import { COLORS } from '../../constants/colors';

interface Props {
  children: React.ReactNode;
}

export const AuthBootstrap: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(logout());
    });

    const bootstrap = async () => {
      try {
        await purgeDemoSessionToken();
        // Wake the API first so session validation does not fail on a cold start.
        await warmupApi();
        const session = await authService.loadStoredSession();
        if (session) {
          dispatch(restoreSession(session));
        } else {
          dispatch(sessionRestoreFailed());
        }
      } catch {
        dispatch(sessionRestoreFailed());
      } finally {
        setReady(true);
      }
    };

    bootstrap();
  }, [dispatch]);

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
