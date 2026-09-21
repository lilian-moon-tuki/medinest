import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
  muted?: boolean;
  elevation?: 'card' | 'soft' | 'none';
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, onPress, padded = true, muted = false, elevation = 'card', style, ...rest }: CardProps) {
  const base: ViewStyle = {
    backgroundColor: muted ? colors.cardMuted : colors.card,
    borderRadius: radius.xl,
    padding: padded ? spacing.xl : 0,
    ...(elevation !== 'none' ? (shadows[elevation] as ViewStyle) : {}),
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, { opacity: pressed ? 0.92 : 1 }, style]} {...rest}>
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[base, style]} {...rest}>
      {children}
    </View>
  );
}

export default Card;
