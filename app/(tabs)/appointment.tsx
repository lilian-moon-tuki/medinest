import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HeaderIcons } from '../../src/components/TopBar';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Overlay } from '../../src/components/Overlay';
import { WheelColumn, WheelCenterLine } from '../../src/components/WheelPicker';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { timeSlots } from '../../src/data/mock';
import { useT, useLang } from '../../src/i18n';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = Array.from({ length: 10 }, (_, i) => 2023 + i);

export default function AppointmentScreen() {
  const t = useT();
  const lang = useLang();

  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(3);
  const [selectedDay, setSelectedDay] = useState(20);
  const [selectedSlot, setSelectedSlot] = useState('09:00');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  // ピッカー用の一時 index
  const [yearIdx, setYearIdx] = useState(YEARS.indexOf(2025));
  const [monthIdx, setMonthIdx] = useState(3);

  const { daysInMonth, leading } = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const dim = new Date(year, month + 1, 0).getDate();
    return { daysInMonth: dim, leading: first };
  }, [year, month]);

  const monthName = (m: number) => (lang === 'en' ? MONTHS_EN[m] : `${m + 1}月`);
  const monthLabel = lang === 'en' ? `${MONTHS_EN[month]} ${year}` : `${year}年 ${month + 1}月`;
  const dateLabel = lang === 'en' ? `${MONTHS_EN[month]} ${selectedDay}, ${year}` : `${year}年${month + 1}月${selectedDay}日`;

  const openPicker = () => {
    setYearIdx(YEARS.indexOf(year));
    setMonthIdx(month);
    setPickerVisible(true);
  };
  const applyPicker = () => {
    setYear(YEARS[yearIdx]);
    setMonth(monthIdx);
    setPickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>{t('appointment.calendarTitle')}</Text>
          <HeaderIcons />
        </View>

        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.calHeader}>
            {/* 月/年ラベル → タップでホイール */}
            <Pressable style={styles.monthBtn} onPress={openPicker}>
              <Text style={styles.month}>{monthLabel}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.primary} />
            </Pressable>
            <View style={styles.navRow}>
              <Pressable hitSlop={10} onPress={() => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth(month - 1); }}>
                <Ionicons name="chevron-back" size={24} color={colors.primary} />
              </Pressable>
              <Pressable hitSlop={10} onPress={() => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth(month + 1); }} style={{ marginLeft: spacing.xl }}>
                <Ionicons name="chevron-forward" size={24} color={colors.primary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS.map((w, i) => (
              <Text key={i} style={styles.weekday}>{w}</Text>
            ))}
          </View>

          <View style={styles.grid}>
            {Array.from({ length: leading }).map((_, i) => (
              <View key={`e${i}`} style={styles.cell} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const selected = d === selectedDay;
              return (
                <Pressable key={d} style={styles.cell} onPress={() => setSelectedDay(d)}>
                  <View style={[styles.dayInner, selected && styles.daySelected]}>
                    <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{d}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card style={{ marginTop: spacing['2xl'] }}>
          <Text style={styles.slotsTitle}>{t('appointment.availableSlots')}</Text>
          <View style={styles.slotGrid}>
            {timeSlots.map((s) => {
              const selected = s === selectedSlot;
              return (
                <Pressable key={s} style={[styles.slot, selected && styles.slotSelected]} onPress={() => setSelectedSlot(s)}>
                  <Text style={[styles.slotText, selected && styles.slotTextSelected]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Button label={t('appointment.book')} variant="gradient" style={{ marginTop: spacing['2xl'] }} onPress={() => router.push({ pathname: '/book-doctor', params: { date: dateLabel, time: selectedSlot } })} />
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>

      {/* 年月ホイールピッカー */}
      <Overlay visible={pickerVisible} onClose={() => setPickerVisible(false)} justify="flex-end">
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Pressable onPress={() => setPickerVisible(false)}><Text style={styles.sheetCancel}>{t('common.cancel')}</Text></Pressable>
            <Pressable onPress={applyPicker}><Text style={styles.sheetDone}>{t('common.done')}</Text></Pressable>
          </View>
          <View style={styles.wheels}>
            <WheelCenterLine />
            <WheelColumn items={YEARS.map((y) => (lang === 'en' ? `${y}` : `${y}年`))} index={yearIdx} onIndexChange={setYearIdx} width={110} />
            <WheelColumn items={Array.from({ length: 12 }, (_, i) => monthName(i))} index={monthIdx} onIndexChange={setMonthIdx} width={110} />
          </View>
        </View>
      </Overlay>

      {/* 予約確認オーバーレイ */}
      <Overlay visible={confirmVisible} onClose={() => setConfirmVisible(false)}>
        <View style={styles.confirmCard}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={40} color={colors.white} />
          </View>
          <Text style={styles.confirmTitle}>{t('appointment.bookedTitle')}</Text>
          <Text style={styles.confirmMsg}>{t('appointment.bookedMsg', { date: dateLabel, time: selectedSlot })}</Text>
          <Button label={t('home.viewDetails')} variant="gradient" style={{ marginTop: spacing.xl }} onPress={() => { setConfirmVisible(false); router.push('/appointment-detail'); }} />
          <Pressable onPress={() => setConfirmVisible(false)} style={{ marginTop: spacing.md }}>
            <Text style={styles.closeText}>{t('common.close')}</Text>
          </Pressable>
        </View>
      </Overlay>
    </SafeAreaView>
  );
}

const CELL = `${100 / 7}%`;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 30, fontWeight: '800', color: colors.textPrimary },

  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  monthBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  month: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  navRow: { flexDirection: 'row', alignItems: 'center' },

  weekRow: { flexDirection: 'row', marginTop: spacing.xl, marginBottom: spacing.sm },
  weekday: { width: CELL, textAlign: 'center', fontSize: 12, fontWeight: '700', color: colors.textTertiary },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayInner: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: colors.primary },
  dayText: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  dayTextSelected: { color: colors.white, fontWeight: '800' },

  slotsTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.lg },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  slot: { width: '31%', height: 54, borderRadius: radius.md, backgroundColor: colors.cardMuted, alignItems: 'center', justifyContent: 'center', ...(shadows.soft as object) },
  slotSelected: { backgroundColor: colors.primary },
  slotText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  slotTextSelected: { color: colors.white },

  sheetOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { width: '100%', backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xl, paddingBottom: spacing['2xl'] },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  sheetCancel: { fontSize: 16, color: colors.textSecondary, fontWeight: '600' },
  sheetDone: { fontSize: 16, color: colors.primary, fontWeight: '800' },
  wheels: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl },

  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing['2xl'] },
  confirmCard: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing['2xl'], alignItems: 'center', width: '100%' },
  checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  confirmTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  confirmMsg: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  closeText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
});
