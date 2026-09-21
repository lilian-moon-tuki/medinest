import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Overlay } from '../../src/components/Overlay';
import { FlipCard } from '../../src/components/FlipCard';
import { QRCode } from '../../src/components/QRCode';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { useApp, useCurrentPatient } from '../../src/store/app';
import { useT } from '../../src/i18n';

const DEVICES = [
  { id: 'apple', name: 'Apple ヘルスケア', color: '#FF4B5C', icon: 'heart' as const },
  { id: 'googlefit', name: 'Google Fit', color: '#4285F4', icon: 'fitness' as const },
  { id: 'omron', name: 'OMRON connect', color: '#0B4DA2', icon: 'pulse' as const },
];

const history = [
  { date: '2024/03/12', title: { ja: '定期健康診断', zh: '定期健康体检', en: 'Health checkup' }, statusKey: 'profile.noAbnormal' },
  { date: '2024/01/15', title: { ja: 'インフルエンザ予防接種', zh: '流感预防接种', en: 'Influenza vaccination' }, statusKey: 'profile.recorded' },
];

const CARD_H = 210;

export default function ProfileScreen() {
  const t = useT();
  const patient = useCurrentPatient();
  const isGuest = useApp((s) => s.isGuest);
  const signOut = useApp((s) => s.signOut);
  const connectedDeviceIds = useApp((s) => s.connectedDeviceIds);
  const toggleDevice = useApp((s) => s.toggleDevice);
  const insurance = useApp((s) => s.insurance);
  const lang = useApp((s) => s.language);
  const [connectTarget, setConnectTarget] = useState<{ id: string; name: string } | null>(null);

  const goLogin = () => { signOut(); router.replace('/login'); };

  const cardFront = (
    <LinearGradient colors={[colors.gradientHealthFrom, colors.gradientHealthTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.patientCard}>
      <View style={styles.patientTop}>
        {patient.avatar ? (
          <Image source={{ uri: patient.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}><Ionicons name="person" size={40} color={colors.white} /></View>
        )}
        <View style={{ flex: 1, marginLeft: spacing.xl }}>
          <Text style={styles.patientLabel}>{t('profile.patientId')}</Text>
          <Text style={styles.patientName}>{isGuest ? t('profile.guest') : patient.fullName || t('profile.notSet')}</Text>
        </View>
      </View>
      <View style={styles.patientMeta}>
        <View>
          <Text style={styles.patientLabel}>{t('profile.patientId')}</Text>
          <Text style={styles.patientValue}>{isGuest ? '—' : patient.patientId || '—'}</Text>
        </View>
        <View>
          <Text style={styles.patientLabel}>{t('profile.bloodType')}</Text>
          <Text style={styles.patientValue}>{isGuest ? '—' : patient.bloodType || t('profile.notSet')}</Text>
        </View>
      </View>
      <View style={styles.flipHint}>
        <Ionicons name={isGuest ? 'log-in-outline' : 'sync-outline'} size={14} color="rgba(255,255,255,0.9)" />
        <Text style={styles.flipHintText}>{isGuest ? t('profile.loginNow') : t('insurance.tapToFlip')}</Text>
      </View>
    </LinearGradient>
  );

  const cardBack = (
    <View style={styles.qrCard}>
      <QRCode size={130} seed={patient.patientId || 'medinest-guest'} />
      <Text style={styles.qrName}>{patient.fullName || t('profile.guest')}</Text>
      <Text style={styles.qrHint}>{t('insurance.qrHint')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
            <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* 患者名片(タップで翻転) */}
        <FlipCard height={CARD_H} front={cardFront} back={cardBack} onPress={isGuest ? goLogin : undefined} />

        {isGuest && (
          <View style={styles.guestBanner}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.guestText}>{t('profile.loginRequiredSub')}</Text>
            <Pressable onPress={goLogin}><Text style={styles.guestLink}>{t('profile.loginNow')}</Text></Pressable>
          </View>
        )}

        {/* 個人情報管理(編集はここ) */}
        <Card style={{ marginTop: spacing.lg }} padded={false} onPress={() => (isGuest ? goLogin() : router.push('/profile-edit'))}>
          <View style={styles.rowItem}>
            <Ionicons name="person-outline" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{t('settings.personalInfo')}</Text>
              <Text style={styles.rowSub}>{isGuest ? t('profile.loginRequired') : patient.email || t('profile.notSet')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </View>
        </Card>

        {/* 連携デバイス */}
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.sectionTitle}>{t('profile.connectedDevices')}</Text>
          {DEVICES.map((d) => {
            const connected = connectedDeviceIds.includes(d.id);
            return (
              <View key={d.id} style={[styles.device, !connected && styles.deviceMuted]}>
                <View style={[styles.deviceIcon, { backgroundColor: d.color + '22' }]}>
                  <Ionicons name={d.icon} size={20} color={d.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviceName}>{d.name}</Text>
                  <Text style={styles.deviceStatus}>{connected ? t('profile.synced') : t('profile.notConnected')}</Text>
                </View>
                {connected ? (
                  <Pressable onPress={() => toggleDevice(d.id)} hitSlop={8}>
                    <Ionicons name="checkmark-circle" size={26} color={colors.success} />
                  </Pressable>
                ) : (
                  <Pressable style={styles.connectBtn} onPress={() => setConnectTarget({ id: d.id, name: d.name })}>
                    <Text style={styles.connectText}>{t('profile.connect')}</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </Card>

        {/* 保険 */}
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.sectionTitle}>{t('profile.insurance')}</Text>
          <View style={styles.insRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.insLabel}>{t('profile.insuranceType')}</Text>
              <Text style={styles.insValue}>{isGuest ? t('profile.loginRequired') : insurance.bound ? insurance.type : t('insuranceBind.notBound')}</Text>
            </View>
            <Ionicons name={insurance.bound && !isGuest ? 'shield-checkmark' : 'shield-outline'} size={28} color={insurance.bound && !isGuest ? colors.success : colors.textTertiary} />
          </View>
          <Button
            label={isGuest ? t('profile.loginNow') : insurance.bound ? t('profile.viewDigitalCard') : t('insuranceBind.bindBtn')}
            variant="primary"
            style={{ marginTop: spacing.lg }}
            onPress={() => (isGuest ? goLogin() : router.push('/insurance'))}
          />
        </Card>

        {/* 診療履歴 */}
        {!isGuest && (
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={styles.sectionTitle}>{t('profile.medicalHistory')}</Text>
            {history.map((h, i) => (
              <View key={i} style={{ marginBottom: spacing.lg }}>
                <Text style={styles.histDate}>{h.date}</Text>
                <Text style={styles.histTitle}>{(h.title as any)[lang]}</Text>
                <Text style={styles.histStatus}>{t(h.statusKey)}</Text>
              </View>
            ))}
            <Button label={t('profile.viewAllRecords')} variant="primary" onPress={() => router.push('/appointments')} />
          </Card>
        )}

        {/* 設定 & ログアウト */}
        <Card style={{ marginTop: spacing.lg }} padded={false}>
          <Pressable style={styles.rowItem} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
            <Text style={[styles.rowTitle, { flex: 1 }]}>{t('profile.accountSettings')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>
          <View style={styles.rowDivider} />
          <Pressable style={styles.rowItem} onPress={goLogin}>
            <Ionicons name={isGuest ? 'log-in-outline' : 'log-out-outline'} size={22} color={colors.danger} />
            <Text style={[styles.rowTitle, { color: colors.danger }]}>{isGuest ? t('profile.loginNow') : t('profile.logout')}</Text>
          </Pressable>
        </Card>

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>

      {/* デバイス連携:アプリ移動の確認 */}
      <Overlay visible={!!connectTarget} onClose={() => setConnectTarget(null)}>
        <View style={styles.dialog}>
          <View style={styles.dialogIcon}><Ionicons name="open-outline" size={28} color={colors.primary} /></View>
          <Text style={styles.dialogTitle}>{t('connectApp.title')}</Text>
          <Text style={styles.dialogMsg}>{t('connectApp.msg', { name: connectTarget?.name ?? '' })}</Text>
          <Button label={t('connectApp.open')} variant="gradient" style={{ marginTop: spacing.lg }} onPress={() => { if (connectTarget) toggleDevice(connectTarget.id); setConnectTarget(null); }} />
          <Pressable onPress={() => setConnectTarget(null)} style={{ marginTop: spacing.md }}>
            <Text style={styles.keepText}>{t('connectApp.cancel')}</Text>
          </Pressable>
        </View>
      </Overlay>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary },

  patientCard: { flex: 1, borderRadius: radius.xl, padding: spacing['2xl'], ...(shadows.floating as object) },
  patientTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.3)' },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  patientLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  patientName: { color: colors.white, fontSize: 26, fontWeight: '800', marginTop: 2 },
  patientMeta: { flexDirection: 'row', gap: spacing['4xl'], marginTop: spacing.lg },
  patientValue: { color: colors.white, fontSize: 20, fontWeight: '800', marginTop: 2 },
  flipHint: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.md },
  flipHintText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600' },

  qrCard: { flex: 1, borderRadius: radius.xl, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...(shadows.floating as object) },
  qrName: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.md },
  qrHint: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  guestBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg, flexWrap: 'wrap' },
  guestText: { flex: 1, fontSize: 13, color: colors.textPrimary },
  guestLink: { fontSize: 13, fontWeight: '800', color: colors.primary },

  rowItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.xl },
  rowTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  rowSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  rowDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.xl },

  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.lg },
  device: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.white, borderRadius: radius.pill, padding: spacing.md, marginBottom: spacing.md, ...(shadows.soft as object) },
  deviceMuted: { backgroundColor: colors.cardMuted },
  deviceIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  deviceName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  deviceStatus: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  connectBtn: { backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, ...(shadows.soft as object) },
  connectText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  insRow: { flexDirection: 'row', alignItems: 'center' },
  insLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  insValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },

  histDate: { fontSize: 13, color: colors.textSecondary },
  histTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
  histStatus: { fontSize: 15, color: colors.success, fontWeight: '700', marginTop: 2 },

  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing['2xl'] },
  dialog: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing['2xl'], alignItems: 'center', width: '100%' },
  dialogIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  dialogTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  dialogMsg: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  keepText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
});
