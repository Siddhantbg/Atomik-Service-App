import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AccountScreenLayout } from '../../../components/common/AccountScreenLayout';
import { Card } from '../../../components/common/Card';
import { COLORS } from '../../../constants/colors';
import { navigateProfileScreen } from '../../../navigation/profileNavigation';

interface Props {
  navigation: any;
}

export const SecurityScreen: React.FC<Props> = ({ navigation }) => (
  <AccountScreenLayout title="Security">
    <Card padding={16}>
      <Text style={styles.title}>Password</Text>
      <Text style={styles.body}>
        Use a strong password and change it periodically. Reset via email if you forget it.
      </Text>
      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => navigateProfileScreen(navigation, 'ForgotPassword')}
      >
        <Text style={styles.linkText}>RESET PASSWORD</Text>
      </TouchableOpacity>
    </Card>
    <Card padding={16} style={styles.card}>
      <Text style={styles.title}>Session</Text>
      <Text style={styles.body}>
        You are signed in on this device. Log out from Profile when using a shared device.
      </Text>
      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() =>
          Alert.alert(
            'Tip',
            'Use Logout on the Profile screen to end your session on this device.'
          )
        }
      >
        <Text style={styles.linkText}>SESSION INFO</Text>
      </TouchableOpacity>
    </Card>
  </AccountScreenLayout>
);

const styles = StyleSheet.create({
  card: { marginTop: 12 },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 20,
  },
  linkBtn: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  linkText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: COLORS.red,
    letterSpacing: 1,
  },
});
