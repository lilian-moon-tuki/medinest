import React, { useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

const ITEM = 46;
const VISIBLE = 5;
const HEIGHT = ITEM * VISIBLE;

interface ColumnProps {
  items: string[];
  index: number;
  onIndexChange: (i: number) => void;
  width?: number;
}

/** 1 列のホイール(スクロールしてスナップ) */
export function WheelColumn({ items, index, onIndexChange, width = 90 }: ColumnProps) {
  const ref = useRef<ScrollView>(null);

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.y / ITEM);
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    if (clamped !== index) onIndexChange(clamped);
  };

  return (
    <View style={{ width, height: HEIGHT }}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: index * ITEM }}
        contentContainerStyle={{ paddingVertical: ITEM * 2 }}
        onMomentumScrollEnd={onEnd}
      >
        {items.map((it, i) => (
          <View key={it} style={styles.item}>
            <Text style={[styles.itemText, i === index && styles.itemActive]}>{it}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/** 中央のハイライトライン */
export function WheelCenterLine() {
  return <View pointerEvents="none" style={styles.centerLine} />;
}

export const WHEEL_HEIGHT = HEIGHT;
export const WHEEL_ITEM = ITEM;

const styles = StyleSheet.create({
  item: { height: ITEM, alignItems: 'center', justifyContent: 'center' },
  itemText: { fontSize: 20, color: colors.textTertiary, fontWeight: '600' },
  itemActive: { color: colors.primary, fontSize: 24, fontWeight: '800' },
  centerLine: {
    position: 'absolute', left: spacing.xl, right: spacing.xl, top: ITEM * 2, height: ITEM,
    borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: colors.border, borderRadius: 8,
  },
});
