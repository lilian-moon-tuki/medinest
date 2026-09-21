import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

interface OverlayProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  justify?: 'center' | 'flex-end';
}

/**
 * 画面内に描画するオーバーレイ(RN の Modal を使わない)。
 * PhoneFrame の scale 変換の内側に留まるので、スマホ枠に収まる。
 */
export function Overlay({ visible, onClose, children, justify = 'center' }: OverlayProps) {
  if (!visible) return null;
  return (
    <View style={[styles.root, { justifyContent: justify }]}>
      <Pressable style={StyleSheet.absoluteFill as any} onPress={onClose} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
});

export default Overlay;
