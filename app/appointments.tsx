import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { colors, radius, spacing, shadows } from '../src/theme';
import { useDoctors, useAppointmentDoctor, usePastVisits } from '../src/data/localized';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

export default function AppointmentsScreen() {
  const t = useT();
  const doctors = useDoctors();
  const fallback = useAppointmentDoctor();
  const pastVisits = usePastVisits();
  const appointments = useApp((s) => s.appointments);

  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const storeCancelled = appointments.filter((a) => a.status === 'cancelled');
  const completed = pastVisits.filter((v) => v.status === 'completed');
  const cancelled = pastVisits.filter((v) => v.status === 'cancelled');

  const docOf = (id: string) => doctors.find((d) => d.id === id) ?? fallback;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('appointment.manageTitle')}</Text>
        <Text style={styles.subtitle}>{t('appointment.manageSub')}</Text>

        {/* 今後の予約 */}
        <Section title={t('appointment.upcoming')} color={colors.primary} />
        {upcoming.length === 0 ? (
          <Card muted elevation="none"><Text style={styles.empty}>{t('appointment.empty')}</Text></Card>
        ) : (
          upcoming.map((a) => {
            const doctor = docOf(a.doctorId);
            return (
              <Card key={a.id} onPress={() => router.push('/appointment-detail')}>
                <View style={styles.docRow}>
                  <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
                  <View style={{ flex: 1, marginLeft: spacing.lg }}>
                    <Text style={styles.docName}>{doctor.name}</Text>
                    <Text style={styles.docDept}>{doctor.hospital}・{doctor.department}</Text>
                  </View>
                  <View style={styles.onlineBadge}><Text style={styles.onlineText}>{t('apptDetail.online')}</Text></View>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="calendar" size={18} color={colors.primary} />
                  <Text style={styles.metaText}>{a.date}  {a.time}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} style={{ marginLeft: 'auto' }} />
                </View>
              </Card>
            );
          })
        )}

        {/* 過去の受診 */}
        <Section title={t('appointment.pastVisits')} color={colors.success} />
        {completed.map((v) => (
          <Card key={v.id} style={{ marginBottom: spacing.lg }} onPress={() => router.push({ pathname: '/visit-detail', params: { id: v.id } })}>
            <View style={styles.visitTop}>
              <Text style={[styles.status, { color: colors.success }]}>{t('appointment.completed')}</Text>
              <Text style={styles.visitDate}>{v.date}</Text>
            </View>
            <Text style={styles.visitDept}>{v.dept}</Text>
            <View style={styles.visitBottom}>
              <Text style={styles.visitDoctor}>{v.doctor}</Text>
              <Text style={styles.viewSummary}>{t('appointment.viewSummary')} →</Text>
            </View>
          </Card>
        ))}

        {/* キャンセル */}
        {(cancelled.length > 0 || storeCancelled.length > 0) && <Section title={t('appointment.sectionCancelled')} color={colors.danger} />}
        {storeCancelled.map((a) => {
          const doctor = docOf(a.doctorId);
          return (
            <Card key={a.id} muted elevation="none" style={{ marginBottom: spacing.lg }} onPress={() => router.push({ pathname: '/visit-detail', params: { id: '2' } })}>
              <View style={styles.visitTop}>
                <Text style={[styles.status, { color: colors.danger }]}>{t('appointment.cancelled')}</Text>
                <Text style={styles.visitDate}>{a.date}</Text>
              </View>
              <Text style={styles.visitDept}>{doctor.department}</Text>
              <View style={styles.visitBottom}>
                <Text style={styles.visitDoctor}>{doctor.name}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </View>
            </Card>
          );
        })}
        {cancelled.map((v) => (
          <Card key={v.id} muted elevation="none" style={{ marginBottom: spacing.lg }} onPress={() => router.push({ pathname: '/visit-detail', params: { id: v.id } })}>
            <View style={styles.visitTop}>
              <Text style={[styles.status, { color: colors.danger }]}>{t('appointment.cancelled')}</Text>
              <Text style={styles.visitDate}>{v.date}</Text>
            </View>
            <Text style={styles.visitDept}>{v.dept}</Text>
            <View style={styles.visitBottom}>
              <Text style={styles.visitDoctor}>{v.doctor}</Text>
              <Text style={styles.cancelNote}>{v.note}</Text>
            </View>
          </Card>
        ))}

        {/* 受診サマリー */}
        <Card style={styles.summaryCard} elevation="none">
          <Text style={styles.summaryTitle}>{t('appointment.summary')} <Text style={styles.summaryPeriod}>{t('appointment.summaryPeriod')}</Text></Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>{t('appointment.totalVisits')}</Text>
              <Text style={styles.summaryValue}>12 <Text style={styles.summaryUnit}>{t('appointment.times')}</Text></Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>{t('appointment.healthScore')}</Text>
              <Text style={styles.summaryValue}>94 <Text style={styles.summaryUnit}>/100</Text></Text>
            </View>
          </View>
        </Card>

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, color }: { title: string; color: string }) {
  return (
    <View style={styles.sectionRow}>
      <View style={[styles.bar, { backgroundColor: color }]} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: spacing.xs },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing['2xl'], marginBottom: spacing.lg },
  bar: { width: 5, height: 22, borderRadius: 3, marginRight: spacing.md },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, flex: 1 },
  empty: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.md },
  docRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.cardMuted },
  docName: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  docDept: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  onlineBadge: { backgroundColor: colors.successSoft, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill },
  onlineText: { fontSize: 12, fontWeight: '700', color: colors.success },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg },
  metaText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  visitTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  visitDate: { fontSize: 13, color: colors.textSecondary },
  visitDept: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.sm },
  visitBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  visitDoctor: { fontSize: 14, color: colors.textSecondary },
  viewSummary: { fontSize: 14, color: colors.primary, fontWeight: '700' },
  cancelNote: { fontSize: 13, color: colors.textSecondary },
  summaryCard: { backgroundColor: colors.primarySoft, marginTop: spacing['2xl'] },
  summaryTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  summaryPeriod: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
  summaryRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
  summaryBox: { flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, ...(shadows.soft as object) },
  summaryLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  summaryValue: { fontSize: 28, fontWeight: '800', color: colors.primary, marginTop: spacing.xs },
  summaryUnit: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
});
