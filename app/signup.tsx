import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { BrandLogo } from '../src/components/BrandLogo';
import { colors, spacing } from '../src/theme';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen() {
  const t = useT();
  const register = useApp((s) => s.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    if (!name.trim()) return setError(t('signup.name'));
    if (!EMAIL_RE.test(email.trim())) return setError(t('login.invalidEmail'));
    if (password.length < 6) return setError(t('login.invalidPassword'));
    if (password !== confirm) return setError(t('signup.mismatch'));
    if (!agreed) return setError(t('signup.agreeError'));
    const result = register(name.trim(), email.trim(), password);
    if (result === 'exists') return setError(t('signup.exists'));
    setError('');
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('signup.title')}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <BrandLogo size={64} />
        </View>

        <TextField label={t('signup.name')} icon="person-outline" placeholder={t('signup.nameExample')} value={name} onChangeText={(v) => { setName(v); setError(''); }} />
        <TextField label={t('signup.email')} icon="mail-outline" placeholder="example@zenith.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={(v) => { setEmail(v); setError(''); }} />
        <TextField label={t('signup.password')} icon="lock-closed-outline" placeholder="••••••••••••" secureTextEntry value={password} onChangeText={(v) => { setPassword(v); setError(''); }} />
        <TextField label={t('signup.confirm')} icon="lock-closed-outline" placeholder="••••••••••••" secureTextEntry value={confirm} onChangeText={(v) => { setConfirm(v); setError(''); }} />

        {/* 利用規約への同意 */}
        <Pressable style={styles.agreeRow} onPress={() => { setAgreed((a) => !a); setError(''); }}>
          <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
            {agreed && <Ionicons name="checkmark" size={16} color={colors.white} />}
          </View>
          <Text style={styles.agreeText}>{t('signup.agree')}</Text>
        </Pressable>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}

        <Button label={t('signup.submit')} variant="gradient" onPress={submit} style={{ marginTop: spacing.sm }} />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>{t('signup.haveAccount')} </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.loginLink}>{t('signup.login')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  container: { paddingHorizontal: spacing['2xl'], paddingBottom: spacing['3xl'] },
  logoWrap: { alignItems: 'center', marginVertical: spacing['2xl'] },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.dangerSoft, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, marginTop: -spacing.sm },
  error: { color: colors.danger, fontSize: 14, fontWeight: '600', flex: 1 },
  agreeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  checkbox: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  agreeText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing['2xl'] },
  loginText: { color: colors.textSecondary, fontSize: 15 },
  loginLink: { color: colors.primary, fontWeight: '800', fontSize: 15, textDecorationLine: 'underline' },
});
