import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderIcons } from '../../src/components/TopBar';
import { Card } from '../../src/components/Card';
import { SearchBar, Suggestion } from '../../src/components/SearchBar';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { useApp, useCurrentPatient } from '../../src/store/app';
import { useAppointmentDoctor, useDoctors } from '../../src/data/localized';
import { useT } from '../../src/i18n';

export default function HomeScreen() {
  const t = useT();
  const patient = useCurrentPatient();
  const vitals = useApp((s) => s.vitals);
  const appointments = useApp((s) => s.appointments);
  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const doctor = useAppointmentDoctor();
  const doctors = useDoctors();

  const latest = (type: string) => vitals.find((v) => v.type === type);
  const hr = latest('heartRate');
  const bp = latest('bloodPressure');
  const greeting = patient.firstName ? t('home.greeting', { name: patient.firstName }) : t('home.greetingNoName');

  const suggestions: Suggestion[] = [
    { label: t('home.onlineCare'), icon: 'globe-outline', onPress: () => router.push('/consultation/symptom') },
    { label: t('home.prescription'), icon: 'clipboard-outline', onPress: () => router.push('/pharmacy') },
    { label: t('home.nearbyClinic'), icon: 'location-outline', onPress: () => router.push('/clinics') },
    { label: t('appointment.calendarTitle'), icon: 'calendar-outline', onPress: () => router.push('/(tabs)/appointment') },
    ...doctors.map((d) => ({ label: d.name, icon: 'person-outline' as const, onPress: () => router.push('/consultation/doctors') })),
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subGreeting}>{t('home.subGreeting')}</Text>
          </View>
          <HeaderIcons />
        </View>

        <SearchBar placeholder={t('common.search')} style={{ marginTop: spacing.lg }} suggestions={suggestions} />

        {/* 体調カード */}
        <Pressable onPress={() => router.push('/health')}>
          <LinearGradient colors={[colors.gradientHealthFrom, colors.gradientHealthTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.healthCard}>
            <View style={styles.healthHeader}>
              <Text style={styles.healthTitle}>{t('home.conditionGood')}</Text>
              <Ionicons name="chevron-forward" size={22} color={colors.white} />
            </View>
            <View style={styles.vitalsRow}>
              <Text style={styles.vital}>{t('home.heartRate')}：{hr?.value ?? '--'} {hr?.unit}</Text>
              <Text style={styles.vital}>{t('home.bloodPressure')}：{bp?.value ?? '--'}</Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* 正方形ショートカット */}
        <View style={styles.shortcutRow}>
          <Card style={styles.shortcut} onPress={() => router.push('/consultation/symptom')}>
            <View style={[styles.shortcutIcon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="globe-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.shortcutTitle}>{t('home.onlineCare')}</Text>
            <Text style={styles.shortcutSub}>{t('home.onlineCareSub')}</Text>
          </Card>
          <Card style={styles.shortcut} onPress={() => router.push('/pharmacy')}>
            <View style={[styles.shortcutIcon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="clipboard-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.shortcutTitle}>{t('home.prescription')}</Text>
            <Text style={styles.shortcutSub}>{t('home.prescriptionSub')}</Text>
          </Card>
        </View>

        {/* 近くのクリニック(単一グラデーションカード・1行) */}
        <Pressable onPress={() => router.push('/clinics')}>
          <LinearGradient colors={[colors.gradientBlueFrom, colors.gradientBlueTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.clinicCard}>
            <View style={styles.clinicIcon}>
              <Ionicons name="location" size={22} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.clinicTitle} numberOfLines={1}>{t('home.nearbyClinic')}</Text>
              <Text style={styles.clinicSub} numberOfLines={1}>{t('home.nearbyClinicSub')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.9)" />
          </LinearGradient>
        </Pressable>

        {/* 予約確認 */}
        <View style={styles.apptHeader}>
          <Text style={styles.sectionTitle}>{t('home.appointmentCheck')}</Text>
          <Pressable style={styles.apptAll} onPress={() => router.push('/appointments')} hitSlop={8}>
            <Text style={styles.apptAllText}>{t('common.seeAll')}</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.primary} />
          </Pressable>
        </View>
        {upcoming.length === 0 ? (
          <Card muted elevation="none" padded><Text style={styles.apptEmpty}>{t('appointment.empty')}</Text></Card>
        ) : (
          <Card style={styles.doctorCard} onPress={() => router.push('/appointment-detail')}>
            <Image source={{ uri: doctor.avatar }} style={styles.doctorAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName} numberOfLines={1}>{doctor.name}</Text>
              <Text style={styles.doctorDept} numberOfLines={1}>{upcoming[0].date}  {upcoming[0].time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Card>
        )}

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  greeting: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subGreeting: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },

  healthCard: { borderRadius: radius.xl, padding: spacing.xl, marginTop: spacing.lg, ...(shadows.floating as object) },
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  healthTitle: { fontSize: 24, fontWeight: '800', color: colors.white },
  vitalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  vital: { fontSize: 16, fontWeight: '700', color: colors.white },

  shortcutRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
  shortcut: { flex: 1, aspectRatio: 1, justifyContent: 'center' },
  shortcutIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  shortcutTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  shortcutSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  clinicCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.xl, padding: spacing.lg, marginTop: spacing.lg, ...(shadows.floating as object) },
  clinicIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  clinicTitle: { fontSize: 17, fontWeight: '800', color: colors.white },
  clinicSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },

  apptHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl, marginBottom: spacing.md },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  apptAll: { flexDirection: 'row', alignItems: 'center' },
  apptAllText: { fontSize: 14, color: colors.primary, fontWeight: '700' },
  apptEmpty: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.sm },
  doctorCard: { flexDirection: 'row', alignItems: 'center' },
  doctorAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: spacing.lg, backgroundColor: colors.cardMuted },
  doctorName: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  doctorDept: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
