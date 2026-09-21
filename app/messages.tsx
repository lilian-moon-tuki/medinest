import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BackHeader } from '../src/components/TopBar';
import { colors, radius, spacing } from '../src/theme';
import { useDoctors } from '../src/data/localized';
import { useT } from '../src/i18n';

export default function MessagesScreen() {
  const t = useT();
  const doctors = useDoctors();
  const previews = [t('msg.preview1'), t('msg.preview2'), t('msg.preview3')];
  const times = ['14:32', '昨日', '9/12'];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title={t('msg.title')} />
      <ScrollView contentContainerStyle={styles.container}>
        {doctors.slice(0, 3).map((d, i) => (
          <Pressable key={d.id} style={styles.row} onPress={() => router.push('/consultation/chat')}>
            <View>
              <Image source={{ uri: d.avatar }} style={styles.avatar} />
              {i === 0 && <View style={styles.online} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.topRow}>
                <Text style={styles.name}>{d.name}</Text>
                <Text style={styles.time}>{times[i]}</Text>
              </View>
              <View style={styles.bottomRow}>
                <Text style={styles.preview} numberOfLines={1}>{previews[i]}</Text>
                {i === 0 && <View style={styles.unread}><Text style={styles.unreadText}>2</Text></View>}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.cardMuted },
  online: { position: 'absolute', right: 0, bottom: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.white },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  time: { fontSize: 12, color: colors.textTertiary },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 },
  preview: { flex: 1, fontSize: 14, color: colors.textSecondary },
  unread: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginLeft: spacing.sm },
  unreadText: { color: colors.white, fontSize: 12, fontWeight: '800' },
});
