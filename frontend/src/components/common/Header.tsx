import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AtomikLogo } from './AtomikLogo';
import { COLORS } from '../../constants/colors';
import { useLayoutInsets } from '../../hooks/useLayoutInsets';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightBadge?: number;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showLogo = false,
  rightIcon,
  onRightPress,
  rightBadge,
  onBackPress,
}) => {
  const navigation = useNavigation();
  const { headerTopPadding } = useLayoutInsets();

  return (
    <View style={[styles.container, { paddingTop: headerTopPadding + 8 }]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={onBackPress ?? (() => navigation.goBack())}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
        )}
        {!showBack && !showLogo && <View style={styles.spacer} />}
      </View>

      <View style={styles.center}>
        {showLogo ? (
          <AtomikLogo size="lg" />
        ) : (
          title && <Text style={styles.title}>{title}</Text>
        )}
      </View>

      <View style={styles.right}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.rightBtn}>
            <Ionicons name={rightIcon} size={22} color={COLORS.white} />
            {rightBadge !== undefined && rightBadge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {rightBadge > 9 ? '9+' : rightBadge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  spacer: {
    width: 22,
  },
  backBtn: {
    padding: 2,
  },
  rightBtn: {
    padding: 2,
    position: 'relative',
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.red,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 8,
    color: COLORS.white,
  },
});
