/**
 * Medinest デザインシステム
 * Figma のデザインから抽出したトークン(色・余白・角丸・影・文字)。
 * すべての画面・コンポーネントはここを参照する。
 */
import { Platform, TextStyle } from 'react-native';

export const colors = {
  // ブランド / プライマリ
  primary: '#3B82F6', // 明るいアクセントブルー(ビデオ通話・選択状態)
  primaryDark: '#2563EB',
  primarySoft: '#EAF1FE', // 薄い青(選択日・タグ背景)

  // ログインボタン等のグラデーション
  gradientBlueFrom: '#5B8DEF',
  gradientBlueTo: '#3D6FD8',

  // 体調カード用グラデーション(明るい水色)
  gradientHealthFrom: '#5EA0F7',
  gradientHealthTo: '#3C79E8',

  // テキスト
  textPrimary: '#1A1D26',
  textSecondary: '#8A8F9C',
  textTertiary: '#B4B9C4',
  textOnPrimary: '#FFFFFF',

  // 背景・サーフェス
  background: '#FFFFFF',
  backgroundAlt: '#F4F6FA', // 画面全体の薄グレー背景
  card: '#FFFFFF',
  cardMuted: '#F5F7FA', // ニューモーフィズム風カード
  border: '#EDEFF3',

  // ステータス
  success: '#3AC569',
  successSoft: '#E5F6EA',
  warning: '#F5A623',
  danger: '#F0574E', // 救急・通話終了
  dangerSoft: '#FDE9E7',

  // その他
  overlay: 'rgba(0,0,0,0.4)',
  shadow: '#1A1D26',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  pill: 999,
} as const;

/** iOS/Android/Web で使える柔らかい影のプリセット */
export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
    },
    android: { elevation: 3 },
    default: {
      // @ts-ignore web boxShadow
      boxShadow: '0 6px 16px rgba(26,29,38,0.06)',
    },
  }),
  soft: Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {
      // @ts-ignore web boxShadow
      boxShadow: '0 2px 8px rgba(26,29,38,0.05)',
    },
  }),
  floating: Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
    },
    android: { elevation: 6 },
    default: {
      // @ts-ignore web boxShadow
      boxShadow: '0 8px 20px rgba(59,130,246,0.25)',
    },
  }),
} as const;

/**
 * 文字スタイル。fontFamily はアプリ起動時に読み込む
 * 丸ゴシック(M PLUS Rounded 1c 等)を後で差し込む。
 */
export const font = {
  // 読み込んだフォントのキー(未ロード時はシステムフォント)
  regular: 'System',
  medium: 'System',
  bold: 'System',
} as const;

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 30, fontWeight: '700', color: colors.textPrimary, letterSpacing: 0.2 },
  h2: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  h3: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400', color: colors.textPrimary },
  bodyMuted: { fontSize: 15, fontWeight: '400', color: colors.textSecondary },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textTertiary },
};

export const theme = { colors, spacing, radius, shadows, typography, font };
export default theme;
