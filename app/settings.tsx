import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { colors, radius, spacing } from '../src/theme';
import { useApp, Lang } from '../src/store/app';
import { useT } from '../src/i18n';

const LANGS: { code: Lang; key: string }[] = [
  { code: 'ja', key: 'settings.languageJa' },
  { code: 'zh', key: 'settings.languageZh' },
  { code: 'en', key: 'settings.languageEn' },
];

export default function SettingsScreen() {
  const t = useT();
  const language = useApp((s) => s.language);
  const setLanguage = useApp((s) => s.setLanguage);
  const notifications = useApp((s) => s.notifications);
  const setNotification = useApp((s) => s.setNotification);

  const notifKeys: { key: keyof typeof notifications; label: string }[] = [
    { key: 'medication', label: 'settings.notifMedication' },
    { key: 'appointment', label: 'settings.notifAppointment' },
    { key: 'message', label: 'settings.notifMessage' },
    { key: 'news', label: 'settings.notifNews' },
  ];

  // 端末通知の許可(Web は Notification API)
  const Notif: any = (globalThis as any).Notification;
  const initialPush = Platform.OS === 'web' && Notif && Notif.permission === 'granted';
  const [pushOn, setPushOn] = useState(!!initialPush);
  const togglePush = async (v: boolean) => {
    if (v && Platform.OS === 'web' && Notif) {
      try {
        const res = await Notif.requestPermission();
        setPushOn(res === 'granted');
        if (res === 'granted') new Notif('Medinest', { body: t('settings.syncPushSub') });
        return;
      } catch { /* noop */ }
    }
    setPushOn(v);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('settings.title')} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* アカウント */}
        <Text style={styles.groupLabel}>{t('settings.account')}</Text>
        <Card padded={false}>
          <Pressable style={styles.row} onPress={() => router.push('/profile-edit')}>
            <Ionicons name="person-outline" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{t('settings.personalInfo')}</Text>
              <Text style={styles.rowSub}>{t('settings.personalInfoSub')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>
        </Card>

        {/* 通知 */}
        <Text style={styles.groupLabel}>{t('settings.notifications')}</Text>
        <Card padded={false}>
          {/* 端末通知の同期 */}
          <View style={styles.row}>
            <Ionicons name="phone-portrait-outline" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{t('settings.syncPush')}</Text>
              <Text style={styles.rowSub}>{pushOn ? t('settings.pushGranted') : t('settings.syncPushSub')}</Text>
            </View>
            <Switch value={pushOn} onValueChange={togglePush} trackColor={{ true: colors.primary, false: '#D5D9E0' }} thumbColor={colors.white} />
          </View>
          <View style={styles.divider} />
          {notifKeys.map((n, i) => (
            <View key={n.key}>
              <View style={styles.row}>
                <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
                <Text style={[styles.rowTitle, { flex: 1 }]}>{t(n.label)}</Text>
                <Switch
                  value={notifications[n.key]}
                  onValueChange={(v) => setNotification(n.key, v)}
                  trackColor={{ true: colors.primary, false: '#D5D9E0' }}
                  thumbColor={colors.white}
                />
              </View>
              {i < notifKeys.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        {/* 言語 */}
        <Text style={styles.groupLabel}>{t('settings.preferences')}</Text>
        <Card padded={false}>
          <View style={styles.langHeader}>
            <Ionicons name="language-outline" size={22} color={colors.primary} />
            <Text style={styles.rowTitle}>{t('settings.language')}</Text>
          </View>
          {LANGS.map((l, i) => {
            const active = l.code === language;
            return (
              <View key={l.code}>
                <View style={styles.divider} />
                <Pressable style={styles.langRow} onPress={() => setLanguage(l.code)}>
                  <Text style={[styles.langText, active && { color: colors.primary, fontWeight: '800' }]}>{t(l.key)}</Text>
                  {active && <Ionicons name="checkmark" size={22} color={colors.primary} />}
                </Pressable>
              </View>
            );
          })}
        </Card>

        {/* アプリについて */}
        <Text style={styles.groupLabel}>{t('settings.about')}</Text>
        <Card padded={false}>
          <View style={styles.row}>
            <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.rowTitle, { flex: 1 }]}>{t('settings.version')}</Text>
            <Text style={styles.rowSub}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <Pressable style={styles.row}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.rowTitle, { flex: 1 }]}>{t('settings.privacy')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row}>
            <Ionicons name="document-text-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.rowTitle, { flex: 1 }]}>{t('settings.terms')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>
        </Card>

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  groupLabel: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginTop: spacing['2xl'], marginBottom: spacing.md, marginLeft: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.xl },
  rowTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  rowSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.xl },
  langHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.xl, paddingBottom: spacing.md },
  langRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, paddingLeft: 54 },
  langText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
});
