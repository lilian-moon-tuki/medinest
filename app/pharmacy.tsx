import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TopBar } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { Tag } from '../src/components/Tag';
import { MedImage } from '../src/components/MedImage';
import { colors, radius, spacing, shadows } from '../src/theme';
import { currentMeds } from '../src/data/mock';
import { useT } from '../src/i18n';

export default function PharmacyScreen() {
  const t = useT();
  const med = currentMeds[0];
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar back />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('pharmacy.title')}</Text>
        <Text style={styles.subtitle}>{t('pharmacy.subtitle')}</Text>

        {/* ビデオ通話バナー */}
        <LinearGradient
          colors={[colors.gradientHealthFrom, colors.gradientHealthTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.availableRow}>
            <View style={styles.dot} />
            <Text style={styles.available}>{t('pharmacy.availableNow')}</Text>
          </View>
          <Text style={styles.bannerTitle}>{t('pharmacy.videoTitle')}</Text>
          <Text style={styles.bannerSub}>{t('pharmacy.videoSub')}</Text>
          <Pressable style={styles.bannerBtn} onPress={() => router.push('/consultation/call')}>
            <Ionicons name="videocam" size={20} color={colors.primary} />
            <Text style={styles.bannerBtnText}>{t('pharmacy.startConsult')}</Text>
          </Pressable>
        </LinearGradient>

        {/* 処方箋受付 */}
        <Card style={{ marginTop: spacing['2xl'] }}>
          <View style={styles.scanRow}>
            <View style={styles.qr}>
              <Ionicons name="qr-code" size={26} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scanTitle}>{t('pharmacy.reception')}</Text>
              <Text style={styles.scanSub}>{t('pharmacy.receptionSub')}</Text>
            </View>
          </View>
          <Pressable style={styles.scanBtn} onPress={() => router.push({ pathname: '/scan', params: { mode: 'qr' } })}>
            <Ionicons name="qr-code-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.scanBtnText}>  {t('pharmacy.scan')}</Text>
          </Pressable>
        </Card>

        {/* デジタル処方箋 */}
        <View style={styles.digitalHeader}>
          <View style={styles.digitalTitleRow}>
            <Ionicons name="document-text" size={22} color={colors.primary} />
            <Text style={styles.digitalTitle}> {t('pharmacy.digital')}</Text>
          </View>
          <View style={styles.expiry}>
            <Text style={styles.expiryText}>{t('pharmacy.expiry')}: 2024/06/15</Text>
          </View>
        </View>

        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.medTop}>
            <MedImage width={120} height={80} category={med.category} />
            <Ionicons name="information-circle-outline" size={24} color={colors.textTertiary} />
          </View>
          <View style={styles.medNameRow}>
            <Text style={styles.medName}>{med.name}</Text>
            <Tag label={med.category} tone="green" />
          </View>
          <Text style={styles.medInstruction}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>1日1回朝食</Text>後に服用してください
          </Text>
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

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: spacing.xs },

  banner: { borderRadius: radius.xl, padding: spacing['2xl'], marginTop: spacing['2xl'], ...(shadows.floating as object) },
  availableRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#8FF0A4' },
  available: { color: '#8FF0A4', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  bannerTitle: { color: colors.white, fontSize: 28, fontWeight: '800', marginTop: spacing.md },
  bannerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: spacing.sm, lineHeight: 20 },
  bannerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.white, height: 52, borderRadius: radius.pill, marginTop: spacing.xl, alignSelf: 'flex-start', paddingHorizontal: spacing['2xl'] },
  bannerBtnText: { color: colors.primary, fontWeight: '800', fontSize: 16 },

  scanRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  qr: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#DFF3E4', alignItems: 'center', justifyContent: 'center' },
  scanTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  scanSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  scanBtn: { flexDirection: 'row', backgroundColor: colors.cardMuted, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  scanBtnText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },

  digitalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing['3xl'] },
  digitalTitleRow: { flexDirection: 'row', alignItems: 'center' },
  digitalTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  expiry: { backgroundColor: colors.primarySoft, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  expiryText: { fontSize: 12, color: colors.primary, fontWeight: '700' },

  medTop: { flexDirection: 'row', justifyContent: 'space-between' },
  medBox: { width: 120, height: 80 },
  medNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md, flexWrap: 'wrap' },
  medName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  medInstruction: { fontSize: 14, color: colors.textPrimary, marginTop: spacing.sm },
  medMeta: { flexDirection: 'row', gap: spacing['2xl'], marginTop: spacing.lg },
  medMetaItem: { flexDirection: 'row', alignItems: 'center' },
  medMetaText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
});
