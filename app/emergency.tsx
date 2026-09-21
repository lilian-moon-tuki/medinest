import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useT } from '../src/i18n';

const RED = '#E1352B';

export default function EmergencyScreen() {
  const t = useT();
  const number = t('emergency.number');

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Pressable style={styles.close} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>

        <View style={styles.center}>
          <View style={styles.pulse}>
            <Ionicons name="medical" size={64} color={RED} />
          </View>
          <Text style={styles.title}>{t('emergency.question')}</Text>
          <Text style={styles.sub}>{t('emergency.sub')}</Text>
          <Text style={styles.bigNumber}>{number}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.callBtn} onPress={() => Linking.openURL(`tel:${number}`)}>
            <Ionicons name="call" size={26} color={RED} />
            <Text style={styles.callText}>{t('emergency.call', { number })}</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>{t('emergency.cancel')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: RED },
  safe: { flex: 1, paddingHorizontal: 28 },
  close: { alignSelf: 'flex-end', marginTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pulse: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  title: { fontSize: 30, fontWeight: '800', color: '#fff', textAlign: 'center' },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 12 },
  bigNumber: { fontSize: 88, fontWeight: '900', color: '#fff', marginTop: 24, letterSpacing: 4 },
  actions: { paddingBottom: 20 },
  callBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#fff', height: 64, borderRadius: 32 },
  callText: { fontSize: 20, fontWeight: '800', color: RED },
  cancelBtn: { alignItems: 'center', justifyContent: 'center', height: 56, marginTop: 12 },
  cancelText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
