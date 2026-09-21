import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { colors, radius, spacing } from '../src/theme';
import { useT } from '../src/i18n';

export default function NotificationsScreen() {
  const t = useT();
  const [read, setRead] = useState(false);

  const items = [
    { id: '1', icon: 'medkit' as const, color: '#3AC569', t: t('notif.i1t'), b: t('notif.i1b'), time: t('notif.i1time') },
    { id: '2', icon: 'calendar' as const, color: '#3B82F6', t: t('notif.i2t'), b: t('notif.i2b'), time: t('notif.i2time') },
    { id: '3', icon: 'flask' as const, color: '#F5A623', t: t('notif.i3t'), b: t('notif.i3b'), time: t('notif.i3time') },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('notif.title')} />
      <View style={styles.actions}>
        <Pressable onPress={() => setRead(true)}><Text style={styles.markAll}>{t('notif.markAll')}</Text></Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {items.map((n) => (
          <Card key={n.id} style={styles.row} elevation="soft">
            <View style={[styles.icon, { backgroundColor: n.color + '22' }]}>
              <Ionicons name={n.icon} size={20} color={n.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{n.t}</Text>
                {!read && <View style={styles.dot} />}
              </View>
              <Text style={styles.body}>{n.b}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  actions: { alignItems: 'flex-end', paddingHorizontal: spacing['2xl'] },
  markAll: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  body: { fontSize: 14, color: colors.textPrimary, marginTop: 2, lineHeight: 20 },
  time: { fontSize: 12, color: colors.textTertiary, marginTop: spacing.xs },
});
