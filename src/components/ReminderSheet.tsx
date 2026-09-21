import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Overlay } from './Overlay';
import { Button } from './Button';
import { colors, radius, spacing } from '../theme';
import { useT } from '../i18n';

const INTERVALS = [4, 6, 8, 12, 24];
const SAFE_MIN = 8; // これ未満は「短すぎ」警告

export function ReminderSheet({ visible, medName, onClose }: { visible: boolean; medName?: string; onClose: () => void }) {
  const t = useT();
  const [hours, setHours] = useState(24);
  const [saved, setSaved] = useState(false);
  const unsafe = hours < SAFE_MIN;

  const save = () => {
    if (unsafe) return; // 危険な間隔は保存させない
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <Overlay visible={visible} onClose={onClose} justify="flex-end">
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>{t('prescriptions.remTitle')}</Text>
        {medName ? <Text style={styles.med}>{medName}</Text> : null}

        {/* 間隔選択 */}
        <Text style={styles.label}>{t('prescriptions.interval')}</Text>
        <View style={styles.chips}>
          {INTERVALS.map((h) => {
            const sel = hours === h;
            return (
              <Pressable key={h} style={[styles.chip, sel && styles.chipSel, sel && h < SAFE_MIN && styles.chipDanger]} onPress={() => setHours(h)}>
                <Text style={[styles.chipText, sel && styles.chipTextSel]}>{t('prescriptions.everyH', { h })}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* 医師の推奨 */}
        <View style={styles.recRow}>
          <Ionicons name="medkit" size={18} color={colors.primary} />
          <Text style={styles.recText}><Text style={{ fontWeight: '800' }}>{t('prescriptions.doctorRec')}: </Text>{t('prescriptions.recValue')}</Text>
        </View>

        {/* 科学用药 or 警告 */}
        {unsafe ? (
          <View style={styles.warnBox}>
            <Ionicons name="warning" size={20} color={colors.danger} />
            <Text style={styles.warnText}>{t('prescriptions.warnUnsafe')}</Text>
          </View>
        ) : (
          <View style={styles.tipBox}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.tipText}><Text style={{ fontWeight: '800' }}>{t('prescriptions.scientific')}: </Text>{t('prescriptions.scientificText')}</Text>
          </View>
        )}

        {saved ? (
          <View style={styles.savedBox}><Ionicons name="checkmark-circle" size={20} color={colors.success} /><Text style={styles.savedText}>{t('prescriptions.saved')}</Text></View>
        ) : null}

        {unsafe ? (
          <Button label={t('prescriptions.consultBtn')} variant="danger" style={{ marginTop: spacing.lg }} icon={<Ionicons name="chatbubbles" size={18} color={colors.white} />} onPress={() => { onClose(); router.push('/consultation/chat'); }} />
        ) : (
          <Button label={t('common.save')} variant="gradient" style={{ marginTop: spacing.lg }} onPress={save} />
        )}
        <Pressable onPress={onClose} style={{ marginTop: spacing.md, alignSelf: 'center' }}>
          <Text style={styles.cancel}>{t('common.cancel')}</Text>
        </Pressable>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  sheet: { width: '100%', backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xl, paddingBottom: spacing.xl },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.lg },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  med: { fontSize: 15, color: colors.textSecondary, marginTop: 2 },
  label: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  chip: { paddingHorizontal: spacing.lg, height: 44, borderRadius: radius.md, backgroundColor: colors.cardMuted, alignItems: 'center', justifyContent: 'center' },
  chipSel: { backgroundColor: colors.primary },
  chipDanger: { backgroundColor: colors.danger },
  chipText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  chipTextSel: { color: colors.white },
  recRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.xl, backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.lg },
  recText: { flex: 1, fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  tipBox: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.md, padding: spacing.lg },
  tipText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  warnBox: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.md, backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: spacing.lg },
  warnText: { flex: 1, fontSize: 13, color: colors.danger, fontWeight: '600', lineHeight: 19 },
  savedBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  savedText: { fontSize: 14, color: colors.success, fontWeight: '700' },
  cancel: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
});

export default ReminderSheet;
