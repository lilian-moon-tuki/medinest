import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderIcons } from '../../src/components/TopBar';
import { Card } from '../../src/components/Card';
import { Tag } from '../../src/components/Tag';
import { MedImage } from '../../src/components/MedImage';
import { ReminderSheet } from '../../src/components/ReminderSheet';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { useCurrentMeds, usePastMeds, LMed } from '../../src/data/localized';
import { useT } from '../../src/i18n';

export default function PrescriptionsScreen() {
  const t = useT();
  const [tab, setTab] = useState<'current' | 'past'>('current');
  const [reminderMed, setReminderMed] = useState<string | null>(null);
  const currentMeds = useCurrentMeds();
  const pastMeds = usePastMeds();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('prescriptions.title')}</Text>
          <HeaderIcons />
        </View>

        <View style={styles.segment}>
          <Pressable style={[styles.segBtn, tab === 'current' && styles.segActive]} onPress={() => setTab('current')}>
            <Text style={[styles.segText, tab === 'current' && styles.segTextActive]}>{t('prescriptions.current')}</Text>
          </Pressable>
          <Pressable style={[styles.segBtn, tab === 'past' && styles.segActive]} onPress={() => setTab('past')}>
            <Text style={[styles.segText, tab === 'past' && styles.segTextActive]}>{t('prescriptions.past')}</Text>
          </Pressable>
        </View>

        {tab === 'current' ? (
          <>
            <LinearGradient colors={[colors.gradientHealthFrom, colors.gradientHealthTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.reminder}>
              <Text style={styles.reminderLabel}>{t('prescriptions.reminder')}</Text>
              <Text style={styles.reminderTime}>9:30 PM</Text>
              <Text style={styles.reminderMed}>{currentMeds[1]?.name}</Text>
              <Pressable style={styles.reminderBtn} onPress={() => setReminderMed(currentMeds[1]?.name ?? '')}>
                <Text style={styles.reminderBtnText}>{t('prescriptions.setNotify')}</Text>
              </Pressable>
            </LinearGradient>

            <View style={styles.metaRow}>
              <Text style={styles.metaTitle}>{t('prescriptions.takingMeds')} ({currentMeds.length})</Text>
              <View style={styles.updatePill}>
                <Text style={styles.updateText}>{t('prescriptions.lastUpdate')}: 09:15</Text>
              </View>
            </View>

            {currentMeds.map((m) => <MedCard key={m.id} med={m} t={t} />)}

            {/* 処方箋受付(正在服用の下に配置) */}
            <ScanCard t={t} />
          </>
        ) : (
          <>
            {pastMeds.map((m) => (
              <Card key={m.id} style={styles.pastCard} onPress={() => router.push({ pathname: '/prescription-detail', params: { id: m.id } })}>
                <MedImage width={76} height={58} category={m.category} />
                <View style={{ flex: 1 }}>
                  <View style={styles.pastNameRow}>
                    <Text style={styles.medName}>{m.name}</Text>
                    <Tag label={m.category} tone="green" />
                  </View>
                  <Text style={styles.pastDate}>{m.date}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
              </Card>
            ))}
          </>
        )}
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>

      <ReminderSheet visible={reminderMed !== null} medName={reminderMed ?? undefined} onClose={() => setReminderMed(null)} />
    </SafeAreaView>
  );
}

function ScanCard({ t }: { t: (k: string, v?: any) => string }) {
  return (
    <View style={styles.scanCard}>
      <View style={styles.scanRow}>
        <View style={styles.qr}><Ionicons name="qr-code" size={26} color={colors.success} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.scanTitle}>{t('pharmacy.reception')}</Text>
          <Text style={styles.scanSub}>{t('pharmacy.receptionSub')}</Text>
        </View>
      </View>
      <Pressable style={styles.scanBtn} onPress={() => router.push({ pathname: '/scan', params: { mode: 'qr' } })}>
        <Ionicons name="qr-code-outline" size={18} color={colors.textPrimary} />
        <Text style={styles.scanBtnText}>  {t('pharmacy.scan')}</Text>
      </Pressable>
    </View>
  );
}

function MedCard({ med, t }: { med: LMed; t: (k: string, v?: any) => string }) {
  return (
    <Card style={{ marginBottom: spacing.lg }} onPress={() => router.push({ pathname: '/prescription-detail', params: { id: med.id } })}>
      <View style={styles.medTop}>
        <MedImage width={110} height={78} category={med.category} />
        <Ionicons name="information-circle-outline" size={24} color={colors.textTertiary} />
      </View>
      <View style={styles.medNameRow}>
        <Text style={styles.medName}>{med.name}</Text>
        <Tag label={med.category} tone="green" />
      </View>
      <Text style={styles.medInstruction}>{med.instruction}</Text>
      <View style={styles.medMeta}>
        <View style={styles.medMetaItem}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.medMetaText}> {med.remaining}</Text>
        </View>
        <View style={styles.medMetaItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.medMetaText}> {med.nextDose}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary },

  segment: { flexDirection: 'row', backgroundColor: colors.cardMuted, borderRadius: radius.lg, padding: 5, marginBottom: spacing['2xl'] },
  segBtn: { flex: 1, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  segActive: { backgroundColor: colors.white, ...(shadows.soft as object) },
  segText: { fontSize: 16, fontWeight: '700', color: colors.textSecondary },
  segTextActive: { color: colors.primary },

  reminder: { borderRadius: radius.xl, padding: spacing['2xl'], ...(shadows.floating as object) },
  reminderLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },
  reminderTime: { color: colors.white, fontSize: 36, fontWeight: '800', marginVertical: spacing.xs },
  reminderMed: { color: 'rgba(255,255,255,0.9)', fontSize: 17, fontWeight: '600' },
  reminderBtn: { backgroundColor: 'rgba(255,255,255,0.25)', height: 48, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, alignSelf: 'flex-start', paddingHorizontal: spacing['2xl'] },
  reminderBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },

  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing['3xl'], marginBottom: spacing.lg },
  metaTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  updatePill: { backgroundColor: colors.primarySoft, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  updateText: { fontSize: 12, color: colors.primary, fontWeight: '600' },

  medTop: { flexDirection: 'row', justifyContent: 'space-between' },
  medBox: { width: 110, height: 78, borderRadius: radius.md },
  medNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md, flexWrap: 'wrap' },
  medName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  medInstruction: { fontSize: 14, color: colors.textPrimary, marginTop: spacing.sm, lineHeight: 20 },
  medMeta: { flexDirection: 'row', gap: spacing['2xl'], marginTop: spacing.lg },
  medMetaItem: { flexDirection: 'row', alignItems: 'center' },
  medMetaText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },

  scanCard: { backgroundColor: colors.primarySoft, borderRadius: radius.xl, padding: spacing.xl, marginTop: spacing.sm },
  scanRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  qr: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#DFF3E4', alignItems: 'center', justifyContent: 'center' },
  scanTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  scanSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  scanBtn: { flexDirection: 'row', backgroundColor: colors.white, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg, ...(shadows.soft as object) },
  scanBtnText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },

  pastCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  pastBox: { width: 76, height: 58, borderRadius: radius.md },
  pastNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  pastDate: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm },
});
