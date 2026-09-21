import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { Tag } from '../src/components/Tag';
import { colors, radius, spacing } from '../src/theme';
import { usePastVisits, useCurrentMeds } from '../src/data/localized';
import { useT } from '../src/i18n';

export default function VisitDetailScreen() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const visits = usePastVisits();
  const meds = useCurrentMeds();
  const visit = visits.find((v) => v.id === id) ?? visits[0];

  const rows = [
    { icon: 'calendar' as const, label: t('visitDetail.date'), value: visit.date },
    { icon: 'medkit' as const, label: t('visitDetail.department'), value: visit.dept },
    { icon: 'person' as const, label: t('visitDetail.doctor'), value: visit.doctor },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('visitDetail.title')} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Card style={{ marginBottom: spacing.lg }} padded={false}>
          {rows.map((r, i) => (
            <View key={i}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}><Ionicons name={r.icon} size={20} color={colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{r.label}</Text>
                  <Text style={styles.infoValue}>{r.value}</Text>
                </View>
              </View>
              {i < rows.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>{t('visitDetail.diagnosis')}</Text>
        <Card><Text style={styles.diagnosis}>{t('visitDetail.diagnosisText')}</Text></Card>

        <Text style={styles.sectionTitle}>{t('visitDetail.summary')}</Text>
        <Card><Text style={styles.bodyText}>{t('visitDetail.summaryText')}</Text></Card>

        <Text style={styles.sectionTitle}>{t('visitDetail.prescription')}</Text>
        {meds.map((m) => (
          <Card key={m.id} style={styles.medRow}>
            <View style={styles.pill}><Ionicons name="medical" size={18} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>{m.name}</Text>
              <Text style={styles.medInstr}>{m.instruction}</Text>
            </View>
            <Tag label={m.category} tone="green" />
          </Card>
        ))}
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  infoValue: { fontSize: 16, color: colors.textPrimary, fontWeight: '700', marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  diagnosis: { fontSize: 17, color: colors.textPrimary, fontWeight: '700' },
  bodyText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  medRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  pill: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  medName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  medInstr: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
