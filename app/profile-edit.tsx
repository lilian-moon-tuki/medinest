import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { colors, spacing } from '../src/theme';
import { useApp, useCurrentPatient } from '../src/store/app';
import { useT } from '../src/i18n';

export default function ProfileEditScreen() {
  const t = useT();
  const patient = useCurrentPatient();
  const updatePatient = useApp((s) => s.updatePatient);

  const [fullName, setFullName] = useState(patient.fullName);
  const [birthday, setBirthday] = useState(patient.birthday);
  const [gender, setGender] = useState(patient.gender);
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);

  const save = () => {
    updatePatient(patient.id, { fullName, birthday, gender, phone, email });
    router.back();
  };

  const genders = [
    { key: 'male', label: t('edit.male') },
    { key: 'female', label: t('edit.female') },
    { key: 'other', label: t('edit.other') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('edit.title')}</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarWrap}>
          <Image source={{ uri: patient.avatar }} style={styles.avatar} />
          <View style={styles.camera}>
            <Ionicons name="camera" size={18} color={colors.white} />
          </View>
        </View>

        <TextField label={t('edit.name')} value={fullName} onChangeText={setFullName} />
        <TextField label={t('edit.birthday')} value={birthday} onChangeText={setBirthday} placeholder="1990-04-12" />

        <Text style={styles.label}>{t('edit.gender')}</Text>
        <View style={styles.genderRow}>
          {genders.map((g) => {
            const active = g.key === gender;
            return (
              <Pressable key={g.key} style={[styles.genderBtn, active && styles.genderActive]} onPress={() => setGender(g.key)}>
                <Text style={[styles.genderText, active && styles.genderTextActive]}>{g.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <TextField label={t('edit.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextField label={t('edit.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Button label={t('common.save')} variant="gradient" onPress={save} style={{ marginTop: spacing.sm }} />
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg },
  avatarWrap: { alignSelf: 'center', marginBottom: spacing['2xl'] },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.cardMuted },
  camera: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.white },
  label: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  genderRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  genderBtn: { flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.cardMuted, alignItems: 'center', justifyContent: 'center' },
  genderActive: { backgroundColor: colors.primary },
  genderText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  genderTextActive: { color: colors.white },
});
