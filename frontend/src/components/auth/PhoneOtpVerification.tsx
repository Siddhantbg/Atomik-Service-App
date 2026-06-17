import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { authService, OtpPurpose } from '../../services/auth';
import { COLORS } from '../../constants/colors';

interface Props {
  phone: string;
  purpose: OtpPurpose;
  onVerifiedChange?: (verified: boolean) => void;
  onOtpChange?: (otp: string) => void;
  phoneError?: string;
  otpError?: string;
  onClearOtpError?: () => void;
}

export const PhoneOtpVerification: React.FC<Props> = ({
  phone,
  purpose,
  onVerifiedChange,
  onOtpChange,
  phoneError,
  otpError,
  onClearOtpError,
}) => {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [localOtpError, setLocalOtpError] = useState('');
  const verifyLock = useRef(false);

  const digits = phone.replace(/\D/g, '');
  const phoneReady = digits.length >= 10;

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  useEffect(() => {
    setOtpSent(false);
    setOtp('');
    setPhoneVerified(false);
    setLocalOtpError('');
    verifyLock.current = false;
    onVerifiedChange?.(false);
    onOtpChange?.('');
  }, [phone, purpose, onVerifiedChange, onOtpChange]);

  const setVerified = useCallback(
    (value: boolean) => {
      setPhoneVerified(value);
      onVerifiedChange?.(value);
    },
    [onVerifiedChange]
  );

  const handleSendOtp = async () => {
    if (!phoneReady || phoneVerified) return;

    setSendingOtp(true);
    setLocalOtpError('');
    onClearOtpError?.();
    setVerified(false);
    setOtp('');
    onOtpChange?.('');
    try {
      const result = await authService.sendOtp(phone, purpose);
      setOtpSent(true);
      setResendIn(result.resendAfter);
    } catch (err: any) {
      if (typeof err.retryAfter === 'number' && err.retryAfter > 0) {
        setResendIn(err.retryAfter);
      }
      setLocalOtpError(err.message || 'Could not send code');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = useCallback(async () => {
    const code = otp.trim();
    if (!otpSent || phoneVerified) return;
    if (code.length !== 6) {
      setLocalOtpError('Enter the 6-digit code');
      return;
    }
    if (verifyLock.current) return;
    verifyLock.current = true;
    setVerifying(true);
    setLocalOtpError('');
    onClearOtpError?.();
    try {
      await authService.verifyOtp(phone, code, purpose);
      setVerified(true);
      onOtpChange?.(code);
    } catch (err: any) {
      setLocalOtpError(err.message || 'Invalid verification code');
      setVerified(false);
    } finally {
      setVerifying(false);
      verifyLock.current = false;
    }
  }, [otp, otpSent, onClearOtpError, phone, phoneVerified, purpose, setVerified, onOtpChange]);

  useEffect(() => {
    if (!otpSent || phoneVerified || otp.trim().length !== 6) return;
    const timer = setTimeout(() => {
      handleVerify();
    }, 400);
    return () => clearTimeout(timer);
  }, [otp, otpSent, phoneVerified, handleVerify]);

  const displayOtpError = otpError || localOtpError;

  return (
    <View style={styles.root}>
      <View style={styles.otpRow}>
        <Button
          label={
            phoneVerified
              ? 'VERIFIED'
              : otpSent
                ? resendIn > 0
                  ? `RESEND IN ${resendIn}s`
                  : 'RESEND OTP'
                : 'SEND OTP'
          }
          onPress={handleSendOtp}
          loading={sendingOtp && !phoneVerified}
          verified={phoneVerified}
          disabled={
            !phoneReady ||
            phoneVerified ||
            sendingOtp ||
            (otpSent && resendIn > 0)
          }
          variant="outline"
          style={styles.otpBtn}
        />
        <Text style={styles.otpHint}>
          {phoneVerified
            ? 'Phone verified — you can create your account'
            : otpSent
              ? 'Enter the code from SMS'
              : phoneError
                ? ''
                : 'We will text you a 6-digit code'}
        </Text>
      </View>

      {otpSent && !phoneVerified ? (
        <>
          <Input
            label="Verification Code"
            placeholder="6-digit OTP"
            value={otp}
            onChangeText={(value) => {
              const next = value.replace(/\D/g, '').slice(0, 6);
              setOtp(next);
              onOtpChange?.(next);
              setLocalOtpError('');
              onClearOtpError?.();
            }}
            keyboardType="numeric"
            icon="keypad-outline"
            error={displayOtpError}
          />
          <Button
            label={verifying ? 'VERIFYING…' : 'VERIFY PHONE'}
            onPress={handleVerify}
            loading={verifying}
            disabled={verifying || otp.trim().length !== 6}
            style={styles.verifyBtn}
          />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: -4,
  },
  otpRow: {
    marginBottom: 12,
    gap: 8,
  },
  otpBtn: {
    alignSelf: 'stretch',
  },
  otpHint: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.gray,
    textAlign: 'center',
  },
  verifyBtn: {
    marginTop: -4,
    marginBottom: 8,
  },
});
