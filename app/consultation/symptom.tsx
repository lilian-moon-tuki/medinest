import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BackHeader } from '../../src/components/TopBar';
import { BodyMap, BodyRegion } from '../../src/components/BodyMap';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { useT } from '../../src/i18n';

export default function SymptomScreen() {
  const t = useT();
  const [region, setRegion] = useState<BodyRegion | null>(null);
  const [note, setNote] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader />
      <View style={styles.container}>
        <Text style={styles.title}>{t('symptom.title')}</Text>
        <Text style={styles.subtitle}>{t('symptom.subtitle')}</Text>

        <View style={styles.bodyWrap}>
          <BodyMap size={320} selected={region?.id} onSelect={setRegion} />
        </View>

        {region && (
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>{region.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('symptom.enterSymptom')}
              placeholderTextColor={colors.textTertiary}
              value={note}
              onChangeText={setNote}
              multiline
            />
            <View style={styles.popupBtns}>
              <Pressable style={[styles.popupBtn, styles.reselect]} onPress={() => setRegion(null)}>
                <Text style={styles.reselectText}>{t('symptom.reselect')}</Text>
              </Pressable>
              <Pressable style={[styles.popupBtn, styles.confirm]} onPress={() => router.push('/consultation/doctors')}>
                <Text style={styles.confirmText}>{t('symptom.confirm')}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing['2xl'] },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary, marginTop: spacing.sm },
  subtitle: { fontSize: 15, color: colors.textPrimary, marginTop: spacing.xs },
  bodyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  popup: {
    position: 'absolute',
    left: spacing['2xl'],
    right: spacing['2xl'],
    top: '42%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...(shadows.card as object),
  },
  popupTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  input: { fontSize: 16, color: colors.textPrimary, marginTop: spacing.md, minHeight: 40 },
  popupBtns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  popupBtn: { flex: 1, height: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  reselect: { backgroundColor: colors.cardMuted },
  reselectText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  confirm: { backgroundColor: colors.primary },
  confirmText: { fontSize: 16, fontWeight: '800', color: colors.white },
});
