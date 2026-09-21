import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from '../src/components/Button';
import { colors, radius, spacing } from '../src/theme';
import { useApp } from '../src/store/app';
import { useT } from '../src/i18n';

export default function ScanScreen() {
  const t = useT();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const isInsurance = mode === 'insurance';
  const [permission, requestPermission] = useCameraPermissions();
  const bindInsurance = useApp((s) => s.bindInsurance);
  const [done, setDone] = useState(false);

  const title = isInsurance ? t('scanDoc.insTitle') : t('pharmacy.reception');
  const sub = isInsurance ? t('scanDoc.insSub') : t('pharmacy.receptionSub');

  const onCapture = () => {
    setDone(true);
    setTimeout(() => {
      if (isInsurance) { bindInsurance('国民健康保険', '28237650304-989D'); router.replace('/insurance'); }
      else { router.back(); }
    }, 900);
  };

  // 権限未取得
  if (!permission || !permission.granted) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.permWrap} edges={['top', 'bottom']}>
          <Pressable style={styles.close} onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          <View style={styles.center}>
            <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.8)" />
            <Text style={styles.permText}>{t('scanDoc.permission')}</Text>
            <Button label={t('scanDoc.capture')} variant="gradient" style={{ marginTop: spacing.xl, alignSelf: 'stretch' }} onPress={requestPermission} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill as any}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={!isInsurance && !done ? () => onCapture() : undefined}
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Pressable style={styles.closeBtn} onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={{ width: 26 }} />
          </View>

          <View style={styles.frameWrap}>
            <View style={[styles.frame, isInsurance && styles.frameWide, done && { borderColor: colors.success }]}>
              {done && <View style={styles.doneOverlay}><Ionicons name="checkmark-circle" size={56} color={colors.success} /></View>}
            </View>
            <Text style={styles.hint}>{sub}</Text>
          </View>

          <View style={styles.bottom}>
            <Pressable style={styles.shutter} onPress={onCapture}>
              <View style={styles.shutterInner}>
                <Ionicons name={isInsurance ? 'camera' : 'qr-code'} size={28} color={colors.primary} />
              </View>
            </Pressable>
            <Text style={styles.shutterLabel}>{t('scanDoc.capture')}</Text>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  permWrap: { flex: 1, paddingHorizontal: spacing['2xl'] },
  close: { alignSelf: 'flex-end', marginTop: spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  permText: { color: '#fff', fontSize: 16, marginTop: spacing.lg, textAlign: 'center' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  frameWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 240, height: 240, borderRadius: 24, borderWidth: 3, borderColor: '#fff' },
  frameWide: { width: 300, height: 190 },
  doneOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 24 },
  hint: { color: '#fff', fontSize: 14, marginTop: spacing.xl, textAlign: 'center', paddingHorizontal: spacing['2xl'] },
  bottom: { alignItems: 'center', paddingBottom: spacing['2xl'] },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterLabel: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: spacing.md },
});
