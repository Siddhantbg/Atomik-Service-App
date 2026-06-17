import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { IndustrialDecor } from './IndustrialDecor';
import { PressableScale } from '../common/PressableScale';
import { COLORS } from '../../constants/colors';
import { Screen } from '../common/Screen';
import { useLayoutInsets } from '../../hooks/useLayoutInsets';

export interface PortalModule {
  id: string;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
  code: string;
  roleLabel: string;
  headline: string;
  tagline: string;
  accent: string;
  signalChain: string[];
  modules: PortalModule[];
  onBack: () => void;
  onAuthenticate: () => void;
}

export const PortalScreenLayout: React.FC<Props> = ({
  code,
  roleLabel,
  headline,
  tagline,
  accent,
  signalChain,
  modules,
  onBack,
  onAuthenticate,
}) => {
  const { topBarStyle, scrollBottomPadding } = useLayoutInsets();

  return (
  <Screen edges={['left', 'right', 'bottom']} style={styles.root}>
    <LinearGradient
      colors={['#080707', COLORS.background, '#1c1819']}
      style={StyleSheet.absoluteFill}
    />
    <IndustrialDecor accent={accent} />

    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: topBarStyle.paddingTop, paddingBottom: scrollBottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={20} color={COLORS.gray} />
        <Text style={styles.backText}>GATEWAY</Text>
      </TouchableOpacity>

      <View style={[styles.roleHeader, { borderColor: `${accent}35` }]}>
        <Text style={[styles.code, { color: accent }]}>{code}</Text>
        <Text style={styles.roleLabel}>{roleLabel}</Text>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>

      <Text style={styles.sectionLabel}>SIGNAL CHAIN</Text>
      <View style={[styles.chainRow, { borderColor: `${accent}25` }]}>
        {signalChain.map((step, i) => (
          <React.Fragment key={step}>
            <Text style={[styles.chainStep, i === 0 && { color: accent }]}>
              {step}
            </Text>
            {i < signalChain.length - 1 && (
              <Ionicons name="chevron-forward" size={10} color={COLORS.grayDark} />
            )}
          </React.Fragment>
        ))}
      </View>

      <Text style={styles.sectionLabel}>MODULE ACCESS</Text>
      {modules.map((m) => (
        <View
          key={m.id}
          style={[styles.moduleCard, { borderLeftColor: accent }]}
        >
          <View style={styles.moduleIcon}>
            <Ionicons name={m.icon} size={18} color={accent} />
          </View>
          <View style={styles.moduleText}>
            <Text style={styles.moduleLabel}>{m.label}</Text>
            <Text style={styles.moduleDesc}>{m.desc}</Text>
          </View>
        </View>
      ))}

      <PressableScale
        style={[styles.authBtn, { backgroundColor: accent }]}
        onPress={onAuthenticate}
        scaleTo={0.97}
      >
        <Ionicons name="shield-checkmark-outline" size={18} color="#000" />
        <Text style={styles.authBtnText}>AUTHENTICATE</Text>
      </PressableScale>

      <Text style={styles.secureNote}>
        Secured session · JWT role isolation · IST operations
      </Text>
    </ScrollView>
  </Screen>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: {
    paddingHorizontal: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 10,
    color: COLORS.gray,
    letterSpacing: 2,
  },
  roleHeader: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginBottom: 28,
  },
  code: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 11,
    letterSpacing: 3,
  },
  roleLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 28,
    color: COLORS.white,
    letterSpacing: 4,
    marginTop: 8,
  },
  headline: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
    marginTop: 12,
  },
  tagline: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 6,
    lineHeight: 18,
  },
  sectionLabel: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 9,
    color: COLORS.grayDark,
    letterSpacing: 3,
    marginBottom: 12,
  },
  chainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    padding: 14,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    marginBottom: 28,
  },
  chainStep: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 8,
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  moduleCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 10,
    gap: 14,
  },
  moduleIcon: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: COLORS.white,
  },
  moduleDesc: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  moduleText: { flex: 1 },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: 4,
    marginTop: 28,
  },
  authBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: '#000000',
    letterSpacing: 3,
  },
  secureNote: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 8,
    color: COLORS.grayDark,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1,
  },
});
