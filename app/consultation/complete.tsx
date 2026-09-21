import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../src/components/Card';
import { Tag } from '../../src/components/Tag';
import { MedImage } from '../../src/components/MedImage';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { useAppointmentDoctor, useCurrentMeds } from '../../src/data/localized';
import { useT } from '../../src/i18n';

export default function CompleteScreen() {
  const t = useT();
  const doctor = useAppointmentDoctor();
  const meds = useCurrentMeds();
  const rxList = [
    { ...meds[0], days: '7日分', usage: '1回1錠 / 1日3回（食後）' },
    { ...meds[1], days: '5日分', usage: '1回1錠 / 1日3回（食後）' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.replace('/home')}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* 完了カード */}
        <Card style={styles.hero} elevation="soft">
          <View style={styles.checkOuter}>
            <View style={styles.checkInner}>
              <Ionicons name="checkmark" size={36} color={colors.white} />
            </View>
          </View>
          <Text style={styles.heroTitle}>{t('complete.title')}</Text>
          <Text style={styles.heroSub}>{t('complete.subtitle')}</Text>
        </Card>

        {/* 医師のアドバイス */}
        <Card style={{ marginTop: spacing.xl }}>
          <View style={styles.docRow}>
            <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <Text style={styles.docName}>{doctor.name}</Text>
              <Text style={styles.docDept}>{doctor.hospital}・{doctor.department}</Text>
            </View>
            <Text style={styles.endTime}>15:30 {t('complete.finished')}</Text>
          </View>
          <Text style={styles.adviceLabel}>{t('complete.advice')}</Text>
          <View style={styles.adviceBox}>
            <Text style={styles.adviceText}>
              本日はお疲れ様でした。喉の炎症が見られますので、本日お出しする抗炎症薬を服用してください。また、水分補給をこまめに行い、室内を乾燥させないよう加湿器の使用をお勧めします。安静にしていれば、2〜3日で症状は改善する見込みです。
            </Text>
          </View>
        </Card>

        {/* 処方薬リスト */}
        <Text style={styles.sectionTitle}>{t('complete.medList')}</Text>
        {rxList.map((m) => (
          <Card key={m.id} style={styles.medCard}>
            <MedImage width={72} height={56} category={m.category} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={styles.daysRow}>
                <View style={styles.daysPill}><Text style={styles.daysText}>{m.days}</Text></View>
                <Tag label={m.category} tone="green" />
              </View>
              <Text style={styles.medName}>{m.name}</Text>
              <Text style={styles.medUsage}>{m.usage}</Text>
            </View>
          </Card>
        ))}

        {/* 次のステップ */}
        <LinearGradient colors={[colors.gradientBlueFrom, colors.gradientBlueTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.nextStep}>
          <Text style={styles.nextTitle}>{t('complete.nextStep')}</Text>
          <Text style={styles.nextSub}>{t('complete.nextStepSub')}</Text>
          <Pressable style={styles.nextBtn} onPress={() => router.replace('/pharmacy')}>
            <Text style={styles.nextBtnText}>{t('complete.goPharmacy')} →</Text>
          </Pressable>
        </LinearGradient>

        {/* DOCUMENTS */}
        <Card style={{ marginTop: spacing.xl }} muted elevation="none">
          <Text style={styles.docsTitle}>{t('complete.documents')}</Text>
          <Pressable style={styles.docItem}>
            <Ionicons name="download-outline" size={20} color={colors.primary} />
            <Text style={styles.docItemText}>{t('complete.downloadReport')}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </Pressable>
          <Pressable style={styles.docItem}>
            <Ionicons name="receipt-outline" size={20} color={colors.success} />
            <Text style={styles.docItemText}>{t('complete.viewReceipt')}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </Pressable>
        </Card>

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm },
  container: { paddingHorizontal: spacing['2xl'] },

  hero: { alignItems: 'center', paddingVertical: spacing['3xl'] },
  checkOuter: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#D9F2E0', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  checkInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 32, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  heroSub: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md, lineHeight: 22 },

  docRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.cardMuted },
  docName: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  docDept: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  endTime: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  adviceLabel: { fontSize: 15, fontWeight: '800', color: colors.primary, marginTop: spacing.xl },
  adviceBox: { borderLeftWidth: 4, borderLeftColor: colors.primary, backgroundColor: colors.cardMuted, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.md },
  adviceText: { fontSize: 14, color: colors.textPrimary, lineHeight: 22 },

  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginTop: spacing['2xl'], marginBottom: spacing.lg },
  medCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  medImg: { width: 72, height: 56 },
  daysRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  daysPill: { backgroundColor: colors.primarySoft, paddingHorizontal: spacing.md, paddingVertical: 3, borderRadius: radius.pill },
  daysText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  medName: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  medUsage: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  nextStep: { borderRadius: radius.xl, padding: spacing['2xl'], marginTop: spacing.xl, ...(shadows.floating as object) },
  nextTitle: { fontSize: 22, fontWeight: '800', color: colors.white },
  nextSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: spacing.sm, lineHeight: 20 },
  nextBtn: { backgroundColor: colors.white, height: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  nextBtnText: { color: colors.primary, fontWeight: '800', fontSize: 16 },

  docsTitle: { fontSize: 15, fontWeight: '800', color: colors.textSecondary, letterSpacing: 0.5, marginBottom: spacing.md },
  docItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.sm, ...(shadows.soft as object) },
  docItemText: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
});
