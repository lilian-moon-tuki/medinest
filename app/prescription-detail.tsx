import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { Tag } from '../src/components/Tag';
import { MedImage } from '../src/components/MedImage';
import { ReminderSheet } from '../src/components/ReminderSheet';
import { colors, radius, spacing } from '../src/theme';
import { useMedById } from '../src/data/localized';
import { useT } from '../src/i18n';

export default function PrescriptionDetailScreen() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const med = useMedById(id);
  const isPast = !!id && id.startsWith('p');
  const [reminderOpen, setReminderOpen] = useState(false);

  if (!med) {
    return (
      <SafeAreaView style={styles.safe}><Text style={{ padding: spacing['2xl'] }}>—</Text></SafeAreaView>
    );
  }

  const info = [
    { icon: 'calendar-outline' as const, label: t('prescriptions.remaining'), value: med.remaining || (med.date ?? '—') },
    { icon: 'time-outline' as const, label: t('prescriptions.nextDose'), value: med.nextDose || '—' },
    { icon: 'medkit-outline' as const, label: t('health.selectType'), value: med.category },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('prescriptions.details')}</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageWrap}>
          <MedImage width={220} height={150} category={med.category} radius={16} />
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.name}>{med.name}</Text>
          <Tag label={med.category} tone="green" />
        </View>
        {med.instruction ? <Text style={styles.instruction}>{med.instruction}</Text> : null}

        <Card style={{ marginTop: spacing.xl }} padded={false}>
          {info.map((row, i) => (
            <View key={i}>
              <View style={styles.infoRow}>
                <Ionicons name={row.icon} size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
              {i < info.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        {isPast ? (
          <Button label={t('prescriptions.reorder')} variant="gradient" style={{ marginTop: spacing.xl }} icon={<Ionicons name="refresh" size={20} color={colors.white} />} onPress={() => router.back()} />
        ) : (
          <Button label={t('prescriptions.setNotify')} variant="gradient" style={{ marginTop: spacing.xl }} icon={<Ionicons name="notifications" size={20} color={colors.white} />} onPress={() => setReminderOpen(true)} />
        )}
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>

      <ReminderSheet visible={reminderOpen} medName={med.name} onClose={() => setReminderOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg },
  imageWrap: { backgroundColor: colors.cardMuted, borderRadius: radius.xl, padding: spacing.md, alignItems: 'center', marginBottom: spacing.xl, overflow: 'hidden' },
  image: { width: '100%', height: 180, borderRadius: radius.lg },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  name: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  instruction: { fontSize: 15, color: colors.textPrimary, marginTop: spacing.md, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.xl },
  infoLabel: { flex: 1, fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
  infoValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.xl },
});
