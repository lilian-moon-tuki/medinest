import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackHeader } from '../../src/components/TopBar';
import { Card } from '../../src/components/Card';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { useDoctors } from '../../src/data/localized';
import { useT } from '../../src/i18n';

export default function DoctorsScreen() {
  const t = useT();
  const doctors = useDoctors();
  const [active, setActive] = useState(0);
  const filters = [t('doctors.fastest'), t('doctors.nearby'), t('doctors.specialty')];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('doctors.title')}</Text>
        <Text style={styles.subtitle}>{t('doctors.subtitle', { count: 24 })}</Text>

        <View style={styles.filterRow}>
          {filters.map((f, i) => (
            <Pressable key={f} style={[styles.filter, active === i && styles.filterActive]} onPress={() => setActive(i)}>
              <Text style={[styles.filterText, active === i && styles.filterTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </View>

        {doctors.map((d) => (
          <Card key={d.id} style={{ marginBottom: spacing.xl }}>
            <View style={styles.docTop}>
              <Image source={{ uri: d.avatar }} style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: spacing.lg }}>
                <Text style={styles.docName}>{d.name}</Text>
                <Text style={styles.docDept}>{d.hospital}・{d.department}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color={colors.primary} />
                  <Text style={styles.rating}> {d.rating}</Text>
                </View>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: d.online ? colors.success : colors.textTertiary }]} />
                  <Text style={[styles.available, { color: d.online ? colors.success : colors.textTertiary }]}>
                    {d.online ? t('doctors.available') : t('doctors.offline')}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.chatBtn} onPress={() => router.push('/consultation/chat')}>
                <Ionicons name="chatbox" size={18} color={colors.textPrimary} />
                <Text style={styles.chatText}> {t('doctors.chat')}</Text>
              </Pressable>
              <Pressable
                style={[styles.videoBtn, !d.online && styles.videoBtnDisabled]}
                disabled={!d.online}
                onPress={() => router.push('/consultation/call')}
              >
                <Ionicons name="videocam" size={18} color={d.online ? colors.white : colors.textTertiary} />
                <Text style={[styles.videoText, !d.online && { color: colors.textTertiary }]}> {t('doctors.video')}</Text>
              </Pressable>
            </View>
          </Card>
        ))}
        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.sm },
  title: { fontSize: 30, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 17, color: colors.textSecondary, marginTop: spacing.xs },

  filterRow: { flexDirection: 'row', gap: spacing.lg, marginVertical: spacing['2xl'] },
  filter: { flex: 1, height: 90, borderRadius: radius.lg, backgroundColor: colors.cardMuted, alignItems: 'center', justifyContent: 'center', ...(shadows.soft as object) },
  filterActive: { backgroundColor: colors.primarySoft },
  filterText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  filterTextActive: { color: colors.primary },

  docTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.cardMuted },
  docName: { fontSize: 19, fontWeight: '800', color: colors.textPrimary },
  docDept: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 16, fontWeight: '800', color: colors.primary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  available: { fontSize: 13, fontWeight: '700' },
  videoBtnDisabled: { backgroundColor: colors.cardMuted, shadowOpacity: 0, elevation: 0 },

  actions: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xl },
  chatBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, paddingHorizontal: spacing.xl, borderRadius: radius.pill, backgroundColor: colors.white, ...(shadows.soft as object) },
  chatText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  videoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: radius.pill, backgroundColor: colors.primary, ...(shadows.floating as object) },
  videoText: { fontSize: 16, fontWeight: '800', color: colors.white },
});
