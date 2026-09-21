import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { colors, radius, spacing, shadows } from '../src/theme';
import { useApp, VitalRecord } from '../src/store/app';
import { useT } from '../src/i18n';

const META: Record<VitalRecord['type'], { icon: keyof typeof Ionicons.glyphMap; color: string; key: string }> = {
  heartRate: { icon: 'heart', color: '#F0574E', key: 'health.heartRate' },
  bloodPressure: { icon: 'pulse', color: '#3B82F6', key: 'health.bloodPressure' },
  bloodSugar: { icon: 'water', color: '#F5A623', key: 'health.bloodSugar' },
  weight: { icon: 'barbell', color: '#3AC569', key: 'health.weight' },
  temperature: { icon: 'thermometer', color: '#EF7CA8', key: 'health.temperature' },
  steps: { icon: 'walk', color: '#7A5AF8', key: 'health.steps' },
};
const ORDER: VitalRecord['type'][] = ['heartRate', 'bloodPressure', 'bloodSugar', 'weight', 'temperature', 'steps'];

export default function HealthScreen() {
  const t = useT();
  const vitals = useApp((s) => s.vitals);
  const connectedCount = useApp((s) => s.connectedDeviceIds.length);
  const [selected, setSelected] = useState<VitalRecord['type']>('heartRate');

  const latestOf = (type: VitalRecord['type']) => vitals.find((v) => v.type === type);
  const historyOf = (type: VitalRecord['type']) => vitals.filter((v) => v.type === type);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('health.title')} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{t('health.subtitle')}</Text>

        {/* デバイス接続チェック入口 */}
        <Pressable style={styles.deviceBar} onPress={() => router.push('/device-check')}>
          <View style={styles.deviceIconWrap}>
            <Ionicons name="watch-outline" size={20} color={colors.primary} />
            <View style={styles.deviceOnDot} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.deviceBarTitle}>{t('deviceCheck.title')}</Text>
            <Text style={styles.deviceBarSub}>{connectedCount} · {t('deviceCheck.online')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </Pressable>

        {/* 指標タイル */}
        <View style={styles.grid}>
          {ORDER.map((type) => {
            const m = META[type];
            const latest = latestOf(type);
            const active = selected === type;
            return (
              <Pressable key={type} style={[styles.tile, active && styles.tileActive]} onPress={() => setSelected(type)}>
                <View style={[styles.tileIcon, { backgroundColor: m.color + '22' }]}>
                  <Ionicons name={m.icon} size={20} color={m.color} />
                </View>
                <Text style={styles.tileLabel}>{t(m.key)}</Text>
                <Text style={styles.tileValue}>{latest?.value ?? '--'}</Text>
                <Text style={styles.tileUnit}>{latest?.unit}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* 選択中の履歴 */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>{t(META[selected].key)} · {t('health.history')}</Text>
        </View>
        {historyOf(selected).map((v) => (
          <Card key={v.id} style={styles.historyRow} elevation="soft">
            <View style={[styles.dot, { backgroundColor: META[selected].color }]} />
            <Text style={styles.historyValue}>{v.value} <Text style={styles.historyUnit}>{v.unit}</Text></Text>
            <Text style={styles.historyDate}>{formatDate(v.date)}</Text>
          </Card>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 記録追加 FAB */}
      <Pressable style={styles.fab} onPress={() => router.push('/health-add')}>
        <Ionicons name="add" size={28} color={colors.white} />
        <Text style={styles.fabText}>{t('health.addRecord')}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.lg },

  deviceBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  deviceIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  deviceOnDot: { position: 'absolute', top: 6, right: 6, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success, borderWidth: 1.5, borderColor: colors.white },
  deviceBarTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  deviceBarSub: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 1 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg },
  tile: { width: '31%', backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'flex-start', borderWidth: 2, borderColor: 'transparent', ...(shadows.soft as object) },
  tileActive: { borderColor: colors.primary },
  tileIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  tileLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  tileValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
  tileUnit: { fontSize: 11, color: colors.textTertiary },

  historyHeader: { marginTop: spacing['3xl'], marginBottom: spacing.md },
  historyTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  historyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
  historyValue: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  historyUnit: { fontSize: 13, color: colors.textSecondary, fontWeight: '400' },
  historyDate: { fontSize: 13, color: colors.textSecondary },

  fab: { position: 'absolute', bottom: spacing['2xl'], right: spacing['2xl'], flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, height: 56, paddingHorizontal: spacing.xl, borderRadius: radius.pill, ...(shadows.floating as object) },
  fabText: { color: colors.white, fontWeight: '800', fontSize: 16, marginLeft: spacing.xs },
});
