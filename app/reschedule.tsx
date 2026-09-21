import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { colors, radius, spacing, shadows } from '../src/theme';
import { timeSlots } from '../src/data/mock';
import { useT } from '../src/i18n';

const DAYS = ['5/24', '5/25', '5/26', '5/27', '5/28'];

export default function RescheduleScreen() {
  const t = useT();
  const [day, setDay] = useState('5/25');
  const [slot, setSlot] = useState('10:00');
  const [done, setDone] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('reschedule.title')}</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Card muted elevation="none" style={{ marginBottom: spacing.xl }}>
          <Text style={styles.currentLabel}>{t('reschedule.current')}</Text>
          <Text style={styles.currentValue}>2024/05/24  14:30 - 15:00</Text>
        </Card>

        <Text style={styles.sectionTitle}>{t('reschedule.newDate')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.md }}>
          {DAYS.map((d) => (
            <Pressable key={d} style={[styles.dayChip, day === d && styles.chipActive]} onPress={() => setDay(d)}>
              <Text style={[styles.dayText, day === d && styles.chipTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.slotGrid}>
          {timeSlots.map((s) => (
            <Pressable key={s} style={[styles.slot, slot === s && styles.chipActive]} onPress={() => setSlot(s)}>
              <Text style={[styles.slotText, slot === s && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>

        {done ? (
          <View style={styles.doneBox}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <Text style={styles.doneText}>{t('reschedule.done')}</Text>
          </View>
        ) : null}

        <Button label={t('reschedule.confirm')} variant="gradient" style={{ marginTop: spacing.xl }} onPress={() => { setDone(true); setTimeout(() => router.back(), 800); }} />
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg },
  currentLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  currentValue: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.md },
  dayChip: { paddingHorizontal: spacing.xl, height: 48, borderRadius: radius.md, backgroundColor: colors.cardMuted, alignItems: 'center', justifyContent: 'center', ...(shadows.soft as object) },
  dayText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md, marginTop: spacing.lg },
  slot: { width: '31%', height: 52, borderRadius: radius.md, backgroundColor: colors.cardMuted, alignItems: 'center', justifyContent: 'center' },
  slotText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  chipActive: { backgroundColor: colors.primary },
  chipTextActive: { color: colors.white },
  doneBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.successSoft, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.xl },
  doneText: { fontSize: 15, fontWeight: '700', color: colors.success },
});
