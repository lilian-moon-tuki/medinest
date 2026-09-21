import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { colors } from '../theme';

export interface BodyRegion {
  id: string;
  label: string;
}

/** タップ可能な部位(枠に対する割合)と、赤ハイライトの中心 */
export const REGIONS: (BodyRegion & { top: number; left: number; width: number; height: number; cx: number; cy: number })[] = [
  { id: 'head', label: '頭部', top: 0.04, left: 0.40, width: 0.20, height: 0.15, cx: 0.5, cy: 0.11 },
  { id: 'chest', label: '胸部・内科領域', top: 0.24, left: 0.34, width: 0.32, height: 0.14, cx: 0.5, cy: 0.31 },
  { id: 'abdomen', label: '腹部', top: 0.40, left: 0.34, width: 0.32, height: 0.14, cx: 0.5, cy: 0.47 },
  { id: 'armL', label: '左腕', top: 0.24, left: 0.22, width: 0.13, height: 0.30, cx: 0.29, cy: 0.4 },
  { id: 'armR', label: '右腕', top: 0.24, left: 0.65, width: 0.13, height: 0.30, cx: 0.71, cy: 0.4 },
  { id: 'legL', label: '左脚', top: 0.56, left: 0.38, width: 0.12, height: 0.40, cx: 0.44, cy: 0.78 },
  { id: 'legR', label: '右脚', top: 0.56, left: 0.50, width: 0.12, height: 0.40, cx: 0.56, cy: 0.78 },
];

interface BodyMapProps {
  size?: number;
  selected?: string | null;
  onSelect: (region: BodyRegion) => void;
}

/** 実写のシルエット画像 + 透明ホットスポット。選択部位に赤いハイライトを重ねる。 */
export function BodyMap({ size = 280, selected, onSelect }: BodyMapProps) {
  const region = REGIONS.find((r) => r.id === selected);
  const blob = size * 0.3;

  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={require('../../assets/img/body.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />

      {/* 選択部位の赤ハイライト */}
      {region && (
        <>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: blob, height: blob, borderRadius: blob / 2,
              left: region.cx * size - blob / 2,
              top: region.cy * size - blob / 2,
              backgroundColor: colors.danger,
              opacity: 0.28,
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: blob * 0.6, height: blob * 0.6, borderRadius: blob * 0.3,
              left: region.cx * size - blob * 0.3,
              top: region.cy * size - blob * 0.3,
              backgroundColor: colors.danger,
              opacity: 0.5,
            }}
          />
        </>
      )}

      {/* 透明ホットスポット */}
      {REGIONS.map((r) => (
        <Pressable
          key={r.id}
          onPress={() => onSelect({ id: r.id, label: r.label })}
          style={{
            position: 'absolute',
            top: r.top * size,
            left: r.left * size,
            width: r.width * size,
            height: r.height * size,
          }}
        />
      ))}
    </View>
  );
}

export default BodyMap;
