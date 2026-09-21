import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect } from 'react-native-svg';
import { BackHeader } from '../src/components/TopBar';
import { BrandLogo } from '../src/components/BrandLogo';
import { Button } from '../src/components/Button';
import { colors, radius, spacing, shadows } from '../src/theme';
import { useApp, useCurrentPatient } from '../src/store/app';
import { useT } from '../src/i18n';

export default function InsuranceScreen() {
  const t = useT();
  const patient = useCurrentPatient();
  const insurance = useApp((s) => s.insurance);

  // 未バインド → 登録を促す
  if (!insurance.bound) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <BackHeader title={t('insurance.title')} />
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}><Ionicons name="card-outline" size={40} color={colors.primary} /></View>
          <Text style={styles.emptyTitle}>{t('insuranceBind.notBound')}</Text>
          <Text style={styles.emptySub}>{t('insuranceBind.sub')}</Text>
          <Button label={t('insuranceBind.bindBtn')} variant="gradient" style={{ marginTop: spacing['2xl'], alignSelf: 'stretch' }} onPress={() => router.push('/insurance-bind')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('insurance.title')} />
      <View style={styles.container}>
        <LinearGradient colors={[colors.gradientBlueFrom, colors.gradientBlueTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
          <View style={styles.cardTop}>
            <BrandLogo size={40} />
            <Text style={styles.brand}>Medinest</Text>
          </View>
          <Text style={styles.holderLabel}>{t('insurance.holder')}</Text>
          <Text style={styles.holderName}>{patient.fullName || t('profile.guest')}</Text>
          <View style={styles.cardMeta}>
            <View>
              <Text style={styles.metaLabel}>{t('profile.patientId')}</Text>
              <Text style={styles.metaValue}>{patient.patientId || '—'}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>{t('insuranceBind.typeLabel')}</Text>
              <Text style={styles.metaValue}>{insurance.type}</Text>
            </View>
          </View>
          <Text style={[styles.metaLabel, { marginTop: spacing.xl }]}>{t('insurance.insurer')}</Text>
          <Text style={styles.insurerNo}>{insurance.number}</Text>
          <View style={styles.barcode}><Barcode /></View>
        </LinearGradient>
        <View style={styles.note}>
          <Ionicons name="lock-closed" size={16} color={colors.textSecondary} />
          <Text style={styles.noteText}>{t('insurance.validUntil')} 2027/03/31</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Barcode() {
  const bars = Array.from({ length: 42 });
  let x = 0;
  return (
    <Svg width="100%" height={54} viewBox="0 0 300 54" preserveAspectRatio="none">
      {bars.map((_, i) => {
        const w = (i * 37) % 5 < 2 ? 2 : 4;
        const rect = <Rect key={i} x={x} y={0} width={w} height={54} fill="#ffffff" opacity={i % 3 === 0 ? 0.9 : 0.55} />;
        x += w + 3;
        return rect;
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing['2xl'], paddingTop: spacing.xl },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing['3xl'] },
  emptyIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  emptySub: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  card: { borderRadius: radius['2xl'], padding: spacing['2xl'], ...(shadows.floating as object) },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  brand: { fontSize: 20, fontWeight: '800', color: colors.white },
  holderLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  holderName: { color: colors.white, fontSize: 28, fontWeight: '800', marginTop: 2 },
  cardMeta: { flexDirection: 'row', gap: spacing['4xl'], marginTop: spacing.xl },
  metaLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  metaValue: { color: colors.white, fontSize: 18, fontWeight: '800', marginTop: 2 },
  insurerNo: { color: colors.white, fontSize: 20, fontWeight: '800', marginTop: 2, letterSpacing: 1 },
  barcode: { marginTop: spacing['2xl'], height: 54 },
  note: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl },
  noteText: { fontSize: 13, color: colors.textSecondary },
});
