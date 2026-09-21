import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing } from '../theme';

const noOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as any) : null;

interface TextFieldProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function TextField({ label, icon, style, secureTextEntry, ...rest }: TextFieldProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.field}>
        {icon ? <Ionicons name={icon} size={20} color={colors.textSecondary} style={{ marginRight: spacing.md }} /> : null}
        <TextInput
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, noOutline, style]}
          secureTextEntry={isPassword ? hidden : false}
          {...rest}
        />
        {isPassword ? (
          <Pressable hitSlop={10} onPress={() => setHidden((h) => !h)}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.xl },
  label: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardMuted,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 58,
    ...(shadows.soft as object),
  },
  input: { flex: 1, fontSize: 16, color: colors.textPrimary, height: '100%' },
});

export default TextField;
