import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { colors, radius, spacing, shadows } from '../src/theme';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

const DEVICES = [
  { id: 'apple', name: 'Apple ヘルスケア', color: '#FF4B5C', icon: 'heart' as const },
  { id: 'googlefit', name: 'Google Fit', color: '#4285F4', icon: 'fitness' as const },
  { id: 'omron', name: 'OMRON connect', color: '#0B4DA2', icon: 'pulse' as const },
];

export default function DeviceCheckScreen() {
  const t = useT();
  const connected = useApp((s) => s.connectedDeviceIds);
  const toggleDevice = useApp((s) => s.toggleDevice);
  const [checking, setChecking] = useState(false);

  const runCheck = () => {
    setChecking(true);
    setTimeout(() => setChecking(false), 1500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('deviceCheck.title')} />
      <ScrollView contentContainerStyle={styles.container}>
        {DEVICES.map((d) => {
          const isOn = connected.includes(d.id);
          return (
            <Card key={d.id} style={styles.row}>
              <View style={[styles.icon, { backgroundColor: d.color + '22' }]}>
                <Ionicons name={d.icon} size={22} color={d.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{d.name}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.dot, { backgroundColor: isOn ? colors.success : colors.textTertiary }]} />
                  <Text style={[styles.status, { color: isOn ? colors.success : colors.textSecondary }]}>
                    {checking ? '...' : isOn ? `${t('deviceCheck.online')} · ${t('deviceCheck.lastSync')} ${isOn ? '2m' : '--'}` : t('deviceCheck.offline')}
                  </Text>
                </View>
              </View>
              <Pressable style={[styles.toggle, isOn ? styles.toggleOn : styles.toggleOff]} onPress={() => toggleDevice(d.id)}>
                <Text style={[styles.toggleText, { color: isOn ? colors.white : colors.textPrimary }]}>
                  {isOn ? t('profile.connected') : t('profile.connect')}
                </Text>
              </Pressable>
            </Card>
          );
        })}

        <Pressable style={styles.checkBtn} onPress={runCheck} disabled={checking}>
          {checking ? <ActivityIndicator color={colors.primary} /> : <Ionicons name="refresh" size={20} color={colors.primary} />}
          <Text style={styles.checkText}>{t('deviceCheck.check')}</Text>
        </Pressable>

        <Pressable style={styles.pairBtn}>
          <Ionicons name="add-circle-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.pairText}>{t('deviceCheck.pair')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  icon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 3 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  status: { fontSize: 13, fontWeight: '600' },
  toggle: { paddingHorizontal: spacing.lg, height: 38, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.success },
  toggleOff: { backgroundColor: colors.cardMuted },
  toggleText: { fontSize: 13, fontWeight: '700' },
  checkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primarySoft, height: 54, borderRadius: radius.pill, marginTop: spacing.md },
  checkText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  pairBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 54, marginTop: spacing.md },
  pairText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
});
