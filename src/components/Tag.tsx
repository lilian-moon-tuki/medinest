import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '../theme';

type Tone = 'green' | 'blue' | 'gray';

const tones: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: '#E5F6EA', fg: '#3AA35A' },
  blue: { bg: '#EAF1FE', fg: '#3B82F6' },
  gray: { bg: '#F0F1F4', fg: '#8A8F9C' },
};

export function Tag({ label, tone = 'green' }: { label: string; tone?: Tone }) {
  const c = tones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '700' },
});

export default Tag;
