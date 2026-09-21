import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadows, spacing } from '../theme';

type Variant = 'primary' | 'gradient' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
  fullWidth = true,
}: ButtonProps) {
  const content = (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, textColor(variant), icon ? { marginLeft: spacing.sm } : null]}>{label}</Text>
        </>
      )}
    </View>
  );

  const base: ViewStyle = {
    ...styles.base,
    ...(fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }),
    opacity: disabled ? 0.5 : 1,
  };

  if (variant === 'gradient') {
    return (
      <Pressable onPress={disabled ? undefined : onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }, style]}>
        <LinearGradient
          colors={[colors.gradientBlueFrom, colors.gradientBlueTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[base, shadows.floating as ViewStyle]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [base, variantStyle(variant), { opacity: pressed && !disabled ? 0.85 : base.opacity }, style]}
    >
      {content}
    </Pressable>
  );
}

function variantStyle(v: Variant): ViewStyle {
  switch (v) {
    case 'primary':
      return { backgroundColor: colors.primary, ...(shadows.floating as ViewStyle) };
    case 'danger':
      return { backgroundColor: colors.danger };
    case 'outline':
      return { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border };
    case 'ghost':
      return { backgroundColor: colors.cardMuted };
    default:
      return {};
  }
}

function textColor(v: Variant) {
  if (v === 'outline' || v === 'ghost') return { color: colors.textPrimary };
  return { color: colors.white };
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.pill,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 16, fontWeight: '700' },
});

export default Button;
