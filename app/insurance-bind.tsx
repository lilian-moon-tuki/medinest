import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { colors, radius, spacing } from '../src/theme';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

export default function InsuranceBindScreen() {
  const t = useT();
  const bindInsurance = useApp((s) => s.bindInsurance);
  const [type, setType] = useState('');
  const [number, setNumber] = useState('');

  const save = () => {
    if (!type.trim() || !number.trim()) return;
    bindInsurance(type.trim(), number.trim());
    router.replace('/insurance');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('insuranceBind.title')}</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Ionicons name="card" size={32} color={colors.primary} /></View>
          <Text style={styles.heroSub}>{t('insuranceBind.sub')}</Text>
        </View>

        {/* 拍照识别 */}
        <Pressable style={styles.photoBtn} onPress={() => router.push({ pathname: '/scan', params: { mode: 'insurance' } })}>
          <Ionicons name="camera" size={22} color={colors.primary} />
          <Text style={styles.photoText}>{t('scanDoc.insTitle')}</Text>
        </Pressable>
        <View style={styles.orRow}>
          <View style={styles.orLine} /><Text style={styles.orText}>{t('login.or')}</Text><View style={styles.orLine} />
        </View>

        <TextField label={t('insuranceBind.typeLabel')} placeholder={t('insuranceBind.typePlaceholder')} value={type} onChangeText={setType} />
        <TextField label={t('insuranceBind.numberLabel')} placeholder={t('insuranceBind.numberPlaceholder')} value={number} onChangeText={setNumber} autoCapitalize="characters" />

        <Button label={t('insuranceBind.save')} variant="gradient" onPress={save} disabled={!type.trim() || !number.trim()} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg },
  hero: { alignItems: 'center', marginBottom: spacing['2xl'] },
  heroIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  heroSub: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: spacing.xl },
  photoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primarySoft, height: 56, borderRadius: radius.lg, marginBottom: spacing.lg },
  photoText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  orRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  orLine: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: { marginHorizontal: spacing.md, color: colors.textSecondary, fontSize: 13 },
});

