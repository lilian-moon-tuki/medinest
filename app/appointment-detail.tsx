import React, { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { Overlay } from '../src/components/Overlay';
import { colors, radius, spacing } from '../src/theme';
import { useDoctors, useAppointmentDoctor } from '../src/data/localized';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

export default function AppointmentDetailScreen() {
  const t = useT();
  const doctors = useDoctors();
  const fallback = useAppointmentDoctor();
  const appointments = useApp((s) => s.appointments);
  const cancelAppointment = useApp((s) => s.cancelAppointment);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const appt = appointments.find((a) => a.status === 'upcoming');
  const doctor = doctors.find((d) => d.id === appt?.doctorId) ?? fallback;
  const dateText = appt ? `${appt.date}  ${appt.time}` : '2024/05/24  14:30 - 15:00';

  const rows = [
    { icon: 'calendar' as const, label: t('apptDetail.datetime'), value: dateText, action: null },
    { icon: 'business' as const, label: t('apptDetail.place'), value: t('apptDetail.clinic'), action: 'nav' as const },
    { icon: 'videocam' as const, label: t('apptDetail.type'), value: appt?.online === false ? t('apptDetail.offline') : t('apptDetail.online'), action: null },
  ];

  const doCancel = () => {
    if (appt) cancelAppointment(appt.id);
    setConfirmCancel(false);
    router.replace('/appointments');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('apptDetail.title')} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Card style={styles.docCard}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: spacing.lg }}>
            <Text style={styles.docName}>{doctor.name}</Text>
            <Text style={styles.docDept}>{doctor.hospital}・{doctor.department}</Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>{t('apptDetail.online')}</Text>
          </View>
        </Card>

        <Card style={{ marginTop: spacing.lg }} padded={false}>
          {rows.map((r, i) => (
            <View key={i}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}><Ionicons name={r.icon} size={20} color={colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{r.label}</Text>
                  <Text style={styles.infoValue}>{r.value}</Text>
                </View>
                {r.action === 'nav' && (
                  <Pressable style={styles.navBtn} onPress={() => Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(t('apptDetail.clinic'))}`)}>
                    <Ionicons name="navigate" size={16} color={colors.white} />
                    <Text style={styles.navBtnText}> {t('apptExtra.navigate')}</Text>
                  </Pressable>
                )}
              </View>
              {i < rows.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>{t('apptDetail.symptom')}</Text>
        <Card><Text style={styles.bodyText}>{t('apptDetail.symptomText')}</Text></Card>

        <Text style={styles.sectionTitle}>{t('apptDetail.notes')}</Text>
        <Card muted elevation="none"><Text style={styles.bodyText}>{t('apptDetail.notesText')}</Text></Card>

        <Button label={t('apptDetail.join')} variant="gradient" icon={<Ionicons name="videocam" size={20} color={colors.white} />} style={{ marginTop: spacing['2xl'] }} onPress={() => router.push('/consultation/call')} />
        <Button label={t('apptExtra.reschedule')} variant="ghost" style={{ marginTop: spacing.md }} onPress={() => router.push('/reschedule')} />
        <Button label={t('apptDetail.cancel')} variant="outline" style={{ marginTop: spacing.md }} onPress={() => setConfirmCancel(true)} />
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>

      {/* キャンセル確認 */}
      <Overlay visible={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <View style={styles.dialog}>
          <View style={styles.warnIcon}><Ionicons name="alert" size={30} color={colors.danger} /></View>
          <Text style={styles.dialogTitle}>{t('apptExtra.cancelConfirm')}</Text>
          <Text style={styles.dialogMsg}>{t('apptExtra.cancelConfirmMsg')}</Text>
          <Button label={t('apptExtra.doCancel')} variant="danger" style={{ marginTop: spacing.lg }} onPress={doCancel} />
          <Pressable onPress={() => setConfirmCancel(false)} style={{ marginTop: spacing.md }}>
            <Text style={styles.keepText}>{t('apptExtra.keep')}</Text>
          </Pressable>
        </View>
      </Overlay>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  docCard: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.cardMuted },
  docName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  docDept: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.successSoft, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  onlineText: { fontSize: 12, fontWeight: '700', color: colors.success },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  infoValue: { fontSize: 16, color: colors.textPrimary, fontWeight: '700', marginTop: 2 },
  navBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: spacing.md, height: 36, borderRadius: radius.pill },
  navBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: spacing['2xl'], marginBottom: spacing.md },
  bodyText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },

  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing['2xl'] },
  dialog: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing['2xl'], alignItems: 'center', width: '100%' },
  warnIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  dialogTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  dialogMsg: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  keepText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
});
