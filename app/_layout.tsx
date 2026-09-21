import { useEffect } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { useApp, Lang } from '../src/store/app';

/** ステータスバー用の空きスペース(実機ではOSがここに時刻・電池等を描画する) */
function SimStatusBar() {
  return <View style={{ height: 44 }} />;
}

const LANG_INIT_KEY = 'medinest-lang-init';

const BASE_W = 390;
const BASE_H = 844;

/**
 * Web/大画面でも iPhone(390×844)の固定キャンバスを等比スケールして表示。
 * 中身は常に 390×844 のレイアウトのまま拡大縮小するので、比率が崩れない。
 */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'web') return <>{children}</>;
  const scale = Math.min(width / BASE_W, height / BASE_H);
  return (
    <View style={{ flex: 1, backgroundColor: '#0E1220', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <View
        style={{
          width: BASE_W,
          height: BASE_H,
          backgroundColor: colors.background,
          overflow: 'hidden',
          transform: [{ scale }],
          // @ts-ignore web-only shadow
          boxShadow: '0 0 40px rgba(0,0,0,0.35)',
        }}
      >
        <SimStatusBar />
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const setLanguage = useApp((s) => s.setLanguage);

  useEffect(() => {
    (async () => {
      const already = await AsyncStorage.getItem(LANG_INIT_KEY);
      if (already) return;
      const code = Localization.getLocales()[0]?.languageCode ?? 'ja';
      const lang: Lang = code === 'zh' ? 'zh' : code === 'en' ? 'en' : 'ja';
      setLanguage(lang);
      await AsyncStorage.setItem(LANG_INIT_KEY, '1');
    })();
  }, [setLanguage]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <PhoneFrame>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="pharmacy" />
            <Stack.Screen name="clinics" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="health" />
            <Stack.Screen name="health-add" options={{ presentation: 'modal' }} />
            <Stack.Screen name="device-check" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="messages" />
            <Stack.Screen name="appointments" />
            <Stack.Screen name="appointment-detail" />
            <Stack.Screen name="book-doctor" />
            <Stack.Screen name="reschedule" options={{ presentation: 'modal' }} />
            <Stack.Screen name="visit-detail" />
            <Stack.Screen name="prescription-detail" options={{ presentation: 'modal' }} />
            <Stack.Screen name="profile-edit" options={{ presentation: 'modal' }} />
            <Stack.Screen name="settings" />
            <Stack.Screen name="insurance" />
            <Stack.Screen name="insurance-bind" options={{ presentation: 'modal' }} />
            <Stack.Screen name="consultation/symptom" />
            <Stack.Screen name="consultation/doctors" />
            <Stack.Screen name="consultation/chat" />
            <Stack.Screen name="consultation/call" options={{ animation: 'fade' }} />
            <Stack.Screen name="consultation/complete" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="emergency" options={{ animation: 'fade', presentation: 'transparentModal' }} />
            <Stack.Screen name="scan" options={{ animation: 'slide_from_bottom' }} />
          </Stack>
        </PhoneFrame>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
