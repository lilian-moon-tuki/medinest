import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { colors, radius, spacing } from '../src/theme';
import { useApp, VitalRecord } from '../src/store/app';
import { useT } from '../src/i18n';

const TYPES: { type: VitalRecord['type']; icon: keyof typeof Ionicons.glyphMap; color: string; key: string; unit: string }[] = [
  { type: 'heartRate', icon: 'heart', color: '#F0574E', key: 'health.heartRate', unit: 'bpm' },
  { type: 'bloodPressure', icon: 'pulse', color: '#3B82F6', key: 'health.bloodPressure', unit: 'mmHg' },
  { type: 'bloodSugar', icon: 'water', color: '#F5A623', key: 'health.bloodSugar', unit: 'mg/dL' },
  { type: 'weight', icon: 'barbell', color: '#3AC569', key: 'health.weight', unit: 'kg' },
  { type: 'temperature', icon: 'thermometer', color: '#EF7CA8', key: 'health.temperature', unit: '°C' },
  { type: 'steps', icon: 'walk', color: '#7A5AF8', key: 'health.steps', unit: '歩' },
];

export default function HealthAddScreen() {
  const t = useT();
  const addVital = useApp((s) => s.addVital);
  const [type, setType] = useState<VitalRecord['type']>('heartRate');
  const [value, setValue] = useState('');

  const meta = TYPES.find((x) => x.type === type)!;

  const submit = () => {
    if (!value.trim()) return;
    addVital({ type, value: value.trim(), unit: meta.unit });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('health.newRecord')}</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>{t('health.selectType')}</Text>
        <View style={styles.grid}>
          {TYPES.map((x) => {
            const active = x.type === type;
            return (
              <Pressable key={x.type} style={[styles.tile, active && { borderColor: x.color, backgroundColor: x.color + '11' }]} onPress={() => setType(x.type)}>
                <View style={[styles.tileIcon, { backgroundColor: x.color + '22' }]}>
                  <Ionicons name={x.icon} size={20} color={x.color} />
                </View>
                <Text style={styles.tileLabel}>{t(x.key)}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: spacing['2xl'] }]}>{t('health.enterValue')} ({meta.unit})</Text>
        <TextField
          placeholder={type === 'bloodPressure' ? '118/76' : '0'}
          keyboardType={type === 'bloodPressure' ? 'default' : 'numeric'}
          value={value}
          onChangeText={setValue}
          autoFocus
        />

        <Button label={t('common.save')} variant="gradient" onPress={submit} disabled={!value.trim()} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg },
  label: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg },
  tile: { width: '31%', backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  tileIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  tileLabel: { fontSize: 12, color: colors.textPrimary, fontWeight: '700', textAlign: 'center' },
});
