import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { useDoctors } from '../../src/data/localized';
import { useT } from '../../src/i18n';

export default function CallScreen() {
  const t = useT();
  const doctor = useDoctors()[0];
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [connected, setConnected] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    const timer = setTimeout(() => setConnected(true), 2800);
    return () => { loop.stop(); clearTimeout(timer); };
  }, [pulse]);

  // 接続待ち(呼び出し)画面
  if (!connected) {
    return (
      <View style={styles.standby}>
        <Image source={{ uri: doctor.avatar }} style={styles.bg} resizeMode="cover" />
        <View style={styles.standbyScrim} />
        <SafeAreaView style={styles.standbyInner} edges={['top', 'bottom']}>
          <View style={{ flex: 1 }} />
          <Animated.View style={[styles.avatarRing, { transform: [{ scale: pulse }] }]} />
          <Image source={{ uri: doctor.avatar }} style={styles.standbyAvatar} />
          <Text style={styles.standbyName}>{doctor.name}</Text>
          <Text style={styles.standbyDept}>{doctor.hospital}・{doctor.department}</Text>
          <Text style={styles.calling}>{t('call.calling')}</Text>
          <Text style={styles.waiting}>{t('call.waiting')}</Text>
          <View style={{ flex: 1 }} />
          <Pressable style={styles.cancelWrap} onPress={() => router.back()}>
            <View style={styles.endBtn}>
              <Ionicons name="call" size={28} color={colors.white} style={{ transform: [{ rotate: '135deg' }] }} />
            </View>
            <Text style={styles.controlLabel}>{t('call.cancel')}</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Image source={{ uri: doctor.avatar }} style={styles.bg} resizeMode="cover" />
      <View style={styles.scrim} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topRow}>
          <View style={styles.namePill}>
            <Text style={styles.docName}>{doctor.name}</Text>
            <Text style={styles.docDept}> {doctor.hospital}・{doctor.department}</Text>
          </View>
          <Pressable style={styles.emergency} onPress={() => router.push('/emergency')}>
            <Text style={styles.emergencyText}>{t('call.emergency')}</Text>
          </Pressable>
        </View>

        <View style={styles.selfView}>
          {videoOff ? (
            <View style={styles.videoOffBox}>
              <Ionicons name="videocam-off" size={28} color="rgba(255,255,255,0.6)" />
            </View>
          ) : null}
          <Text style={styles.selfLabel}>{t('call.you')}</Text>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.memo}>
          <Text style={styles.memoTitle}>{t('call.memo')}</Text>
          <Text style={styles.memoLine}>{t('call.currentSymptom')}：頭痛、軽い発熱</Text>
          <Text style={styles.memoLine}>{t('call.prescriptionHistory')}：昨年10月の定期健診データ参照</Text>
          <View style={styles.memoDivider} />
          <Text style={styles.memoLine}>{t('call.connectTime')}：13:23</Text>
        </View>

        <View style={styles.rxNotice}>
          <Ionicons name="checkmark-circle" size={22} color={colors.white} />
          <Text style={styles.rxText}>{t('call.rxReady')}</Text>
          <Pressable style={styles.rxBtn} onPress={() => router.replace('/consultation/complete')}>
            <Text style={styles.rxBtnText}>{t('common.confirm')}</Text>
          </Pressable>
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.control} onPress={() => setMuted((v) => !v)}>
            <View style={[styles.controlBtn, muted && styles.controlBtnActive]}>
              <Ionicons name={muted ? 'mic-off' : 'mic'} size={26} color={muted ? colors.white : colors.textPrimary} />
            </View>
            <Text style={styles.controlLabel}>{t('call.mute')}</Text>
          </Pressable>

          <Pressable style={styles.endWrap} onPress={() => router.replace('/consultation/complete')}>
            <View style={styles.endBtn}>
              <Ionicons name="call" size={30} color={colors.white} style={{ transform: [{ rotate: '135deg' }] }} />
            </View>
            <Text style={styles.controlLabel}>{t('call.end')}</Text>
          </Pressable>

          <Pressable style={styles.control} onPress={() => setVideoOff((v) => !v)}>
            <View style={[styles.controlBtn, videoOff && styles.controlBtnActive]}>
              <Ionicons name={videoOff ? 'videocam-off' : 'videocam'} size={26} color={videoOff ? colors.white : colors.textPrimary} />
            </View>
            <Text style={styles.controlLabel}>{t('call.video')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  standby: { flex: 1, backgroundColor: '#0E1220' },
  standbyScrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14,18,32,0.72)' },
  standbyInner: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl },
  avatarRing: { position: 'absolute', top: '34%', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.15)' },
  standbyAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)' },
  standbyName: { fontSize: 24, fontWeight: '800', color: colors.white, marginTop: spacing.xl },
  standbyDept: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  calling: { fontSize: 17, fontWeight: '700', color: colors.white, marginTop: spacing['2xl'] },
  waiting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: spacing.sm },
  cancelWrap: { alignItems: 'center', marginBottom: spacing.xl },
  bg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.12)' },
  safe: { flex: 1, paddingHorizontal: spacing.xl },

  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  namePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill },
  docName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  docDept: { fontSize: 12, color: colors.textSecondary },
  emergency: { backgroundColor: '#F1837B', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.pill },
  emergencyText: { color: colors.white, fontWeight: '800', fontSize: 15 },

  selfView: { width: 110, height: 150, backgroundColor: '#111', borderRadius: radius.lg, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: spacing.lg },
  selfLabel: { color: colors.white, fontSize: 15, fontWeight: '600' },

  memo: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.md },
  memoTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  memoLine: { fontSize: 15, color: colors.textPrimary, marginTop: spacing.xs },
  memoDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },

  rxNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59,130,246,0.85)', borderRadius: radius.pill, padding: spacing.md, marginBottom: spacing.lg },
  rxText: { flex: 1, color: colors.white, fontWeight: '700', fontSize: 15, marginLeft: spacing.sm },
  rxBtn: { backgroundColor: colors.primaryDark, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.pill },
  rxBtnText: { color: colors.white, fontWeight: '800' },

  controls: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: radius.xl, paddingVertical: spacing.xl },
  control: { alignItems: 'center' },
  controlBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(200,205,215,0.9)', alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: colors.danger },
  videoOffBox: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  controlLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.sm },
  endWrap: { alignItems: 'center' },
  endBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', ...(shadows.floating as object) },
});
