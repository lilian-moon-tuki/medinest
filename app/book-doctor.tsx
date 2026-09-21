import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { BackHeader } from '../src/components/TopBar';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { colors, radius, spacing, shadows } from '../src/theme';
import { useDoctors } from '../src/data/localized';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

const HOSPITALS = [
  { id: 'h1', distanceKm: 0.8, past: true, name: { ja: 'ゼニス総合病院', zh: '泽尼斯综合医院', en: 'Zenith General Hospital' } },
  { id: 'h2', distanceKm: 1.6, past: false, name: { ja: '鴨川メディカルセンター', zh: '鸭川医疗中心', en: 'Kamogawa Medical Center' } },
  { id: 'h3', distanceKm: 2.4, past: true, name: { ja: '京都中央クリニック', zh: '京都中央诊所', en: 'Kyoto Central Clinic' } },
];

export default function BookDoctorScreen() {
  const t = useT();
  const lang = useApp((s) => s.language);
  const addAppointment = useApp((s) => s.addAppointment);
  const { date, time } = useLocalSearchParams<{ date: string; time: string }>();

  const [source, setSource] = useState<'nearby' | 'past'>('nearby');
  const [located, setLocated] = useState(false);
  const [locating, setLocating] = useState(false);
  const [hospital, setHospital] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  const doctors = useDoctors(hospital ?? undefined);
  const canComplete = hospital && doctorId;

  const getLocation = async () => {
    setLocating(true);
    try { await Location.requestForegroundPermissionsAsync(); await Location.getCurrentPositionAsync({}); } catch {}
    setLocated(true);
    setLocating(false);
  };

  const list = source === 'past' ? HOSPITALS.filter((h) => h.past) : HOSPITALS;

  const complete = () => {
    if (!canComplete) return;
    addAppointment({ status: 'upcoming', doctorId: doctorId!, date: date ?? '2025/04/20', time: time ?? '09:00', online: true });
    router.replace('/appointment-detail');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('book.title')} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>{t('book.step', { n: 2 })}</Text>
        <View style={styles.dateChip}>
          <Ionicons name="calendar" size={18} color={colors.primary} />
          <Text style={styles.dateChipText}>{date ?? '—'}  {time ?? ''}</Text>
        </View>

        {/* 病院ソース切替 */}
        <View style={styles.segment}>
          <Pressable style={[styles.segBtn, source === 'nearby' && styles.segActive]} onPress={() => setSource('nearby')}>
            <Ionicons name="navigate" size={16} color={source === 'nearby' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.segText, source === 'nearby' && styles.segTextActive]}> {t('book.nearbyTab')}</Text>
          </Pressable>
          <Pressable style={[styles.segBtn, source === 'past' && styles.segActive]} onPress={() => setSource('past')}>
            <Ionicons name="time" size={16} color={source === 'past' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.segText, source === 'past' && styles.segTextActive]}> {t('book.pastTab')}</Text>
          </Pressable>
        </View>

        {/* 現在地から探す(nearbyのみ) */}
        {source === 'nearby' && !located && (
          <Pressable style={styles.locateBtn} onPress={getLocation}>
            {locating ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name="locate" size={20} color={colors.primary} />}
            <Text style={styles.locateText}>{locating ? t('book.locating') : t('book.enableLocation')}</Text>
          </Pressable>
        )}

        {/* 病院リスト */}
        <Text style={styles.sectionTitle}>{t('book.selectHospital')}</Text>
        {list.map((h) => {
          const sel = hospital === h.id;
          return (
            <Pressable key={h.id} style={[styles.hospital, sel && styles.selected]} onPress={() => { setHospital(h.id); setDoctorId(null); }}>
              <View style={styles.hospIcon}><Ionicons name="business" size={20} color={sel ? colors.primary : colors.textSecondary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.hospitalName, sel && { color: colors.primary }]}>{(h.name as any)[lang]}</Text>
                {(source === 'nearby' && located) && <Text style={styles.hospDist}>{h.distanceKm} {t('book.km')}</Text>}
                {source === 'past' && <Text style={styles.hospDist}>{t('book.pastTab')}</Text>}
              </View>
              {sel && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </Pressable>
          );
        })}

        {/* 医師(病院に紐づく) */}
        {hospital && (
          <>
            <Text style={styles.sectionTitle}>{t('book.noDoctor')}</Text>
            {doctors.map((d) => {
              const sel = doctorId === d.id;
              return (
                <Card key={d.id} style={[styles.doctor, sel && styles.selected]} onPress={() => setDoctorId(d.id)}>
                  <Image source={{ uri: d.avatar }} style={styles.avatar} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.docName}>{d.name}</Text>
                    <View style={styles.statusRow}>
                      <View style={[styles.dot, { backgroundColor: d.online ? colors.success : colors.textTertiary }]} />
                      <Text style={[styles.docStatus, { color: d.online ? colors.success : colors.textTertiary }]}>{d.online ? t('doctors.available') : t('doctors.offline')}</Text>
                    </View>
                  </View>
                  <View style={styles.ratingRow}><Ionicons name="star" size={14} color={colors.primary} /><Text style={styles.rating}> {d.rating}</Text></View>
                  {sel && <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={{ marginLeft: spacing.sm }} />}
                </Card>
              );
            })}
          </>
        )}

        <Button label={t('book.complete')} variant="gradient" disabled={!canComplete} style={{ marginTop: spacing.xl }} onPress={complete} />
        {!canComplete && <Text style={styles.hint}>{t('book.chooseFirst')}</Text>}
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  step: { fontSize: 13, fontWeight: '700', color: colors.primary, marginBottom: spacing.md },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: spacing.lg, height: 44, alignSelf: 'flex-start' },
  dateChipText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  segment: { flexDirection: 'row', backgroundColor: colors.cardMuted, borderRadius: radius.lg, padding: 5, marginTop: spacing.xl },
  segBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: radius.md },
  segActive: { backgroundColor: colors.white, ...(shadows.soft as object) },
  segText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  segTextActive: { color: colors.primary },
  locateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primarySoft, height: 48, borderRadius: radius.md, marginTop: spacing.lg },
  locateText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: spacing['2xl'], marginBottom: spacing.md },
  hospital: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 2, borderColor: 'transparent', ...(shadows.soft as object) },
  hospIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  hospitalName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  hospDist: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  selected: { borderWidth: 2, borderColor: colors.primary },
  doctor: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, borderWidth: 2, borderColor: 'transparent' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.cardMuted },
  docName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  docStatus: { fontSize: 12, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 14, fontWeight: '800', color: colors.primary },
  hint: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md },
});
