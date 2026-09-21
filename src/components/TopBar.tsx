import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing } from '../theme';

interface TopBarProps {
  /** 左側に戻るボタンを出す(スタック画面用)。false なら位置ピン。 */
  back?: boolean;
  onBack?: () => void;
}

/** 全画面共通のヘッダー:左=戻る(任意)、右=通知ベルとチャット。位置ピンは廃止。 */
export function TopBar({ back = false, onBack }: TopBarProps) {
  return (
    <View style={styles.bar}>
      {back ? (
        <Pressable hitSlop={12} onPress={onBack ?? (() => router.back())} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}

      <View style={styles.right}>
        <Pressable hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={23} color={colors.textPrimary} />
        </Pressable>
        <Pressable hitSlop={10} style={[styles.iconBtn, { marginLeft: spacing.lg }]}>
          <Ionicons name="chatbox-outline" size={23} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

/** 右上の通知ベル + チャットアイコン(タップで各ページへ) */
export function HeaderIcons() {
  return (
    <View style={styles.right}>
      <Pressable hitSlop={10} style={styles.iconBtn} onPress={() => router.push('/notifications')}>
        <Ionicons name="notifications-outline" size={23} color={colors.textPrimary} />
        <View style={styles.badge} />
      </Pressable>
      <Pressable hitSlop={10} style={[styles.iconBtn, { marginLeft: spacing.lg }]} onPress={() => router.push('/messages')}>
        <Ionicons name="chatbox-outline" size={23} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

/** タイトル付きのシンプルな戻るヘッダー */
export function BackHeader({ title }: { title?: string }) {
  return (
    <View style={styles.bar}>
      <Pressable hitSlop={12} onPress={() => router.back()} style={styles.iconBtn}>
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  right: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
});

export default TopBar;
