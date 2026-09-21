import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { BrandLogo } from '../src/components/BrandLogo';
import { GoogleIcon, FacebookIcon, LineIcon } from '../src/components/BrandIcons';
import { colors, spacing } from '../src/theme';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const t = useT();
  const login = useApp((s) => s.login);
  const signInGuest = useApp((s) => s.signInGuest);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const doLogin = () => {
    if (!email.trim()) return setError(t('login.emailRequired'));
    if (!EMAIL_RE.test(email.trim())) return setError(t('login.invalidEmail'));
    if (!password) return setError(t('login.passwordRequired'));
    // 疑似バックエンドで照合
    const result = login(email.trim(), password);
    if (result === 'notRegistered') return setError(t('login.notRegistered'));
    if (result === 'wrongPassword') return setError(t('login.wrongPassword'));
    setError('');
    router.replace('/home');
  };

  // 第三者ログインは公式サイトをブラウザで開く(アプリには入らない)
  const social = [
    { id: 'line', label: 'LINE', url: 'https://line.me/', Icon: LineIcon },
    { id: 'google', label: 'Google', url: 'https://accounts.google.com/', Icon: GoogleIcon },
    { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/login/', Icon: FacebookIcon },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <BrandLogo size={84} />
          <Text style={styles.brand}>Medinest</Text>
        </View>

        <TextField
          label={t('login.emailLabel')}
          icon="person-outline"
          placeholder="example@zenith.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(v) => { setEmail(v); setError(''); }}
        />
        <TextField
          label={t('login.passwordLabel')}
          icon="lock-closed-outline"
          placeholder="••••••••••••"
          secureTextEntry
          value={password}
          onChangeText={(v) => { setPassword(v); setError(''); }}
        />

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}

        <Button label={t('login.login')} variant="gradient" onPress={doLogin} style={{ marginTop: spacing.sm }} />

        <Button
          label={t('login.guest')}
          variant="ghost"
          icon={<Ionicons name="person-circle-outline" size={20} color={colors.textPrimary} />}
          onPress={() => { signInGuest(); router.replace('/home'); }}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.demoHint}>{t('login.demoHint')}</Text>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>{t('login.or')}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          {social.map((s) => (
            <Pressable key={s.id} style={styles.social} onPress={() => Linking.openURL(s.url)}>
              <View style={styles.socialIcon}>
                <s.Icon size={34} />
              </View>
              <Text style={styles.socialLabel}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.signup}>
          <Text style={styles.signupText}>{t('login.noAccount')} </Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>{t('login.signup')}</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLink}>{t('login.terms')}</Text>
          <Text style={styles.footerLink}>{t('login.privacy')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingBottom: spacing['3xl'], flexGrow: 1 },
  logoWrap: { alignItems: 'center', marginTop: spacing['4xl'], marginBottom: spacing['3xl'] },
  brand: { fontSize: 30, fontWeight: '800', color: colors.primary, marginTop: spacing.md, letterSpacing: 0.5 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.dangerSoft, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, marginTop: -spacing.sm },
  error: { color: colors.danger, fontSize: 14, fontWeight: '600', flex: 1 },
  demoHint: { textAlign: 'center', color: colors.textTertiary, fontSize: 12, marginTop: spacing.md },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { marginHorizontal: spacing.lg, color: colors.textSecondary, fontSize: 15 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-around' },
  social: { alignItems: 'center' },
  socialIcon: { width: 62, height: 62, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  socialLabel: { marginTop: spacing.sm, fontWeight: '700', color: colors.textPrimary },
  signup: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing['3xl'], flexWrap: 'wrap' },
  signupText: { color: colors.textSecondary, fontSize: 15 },
  signupLink: { color: colors.primary, fontWeight: '800', fontSize: 15, textDecorationLine: 'underline' },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing['3xl'], marginTop: spacing['2xl'] },
  footerLink: { color: colors.textSecondary, fontSize: 13, textDecorationLine: 'underline' },
});
