import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { colors } from '../theme';

/**
 * Medinest ロゴ:青い同心円で描いた "C" と赤い十字(＋)。
 * Figma のロゴを SVG で近似。
 */
export function BrandLogo({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G>
        {/* 外側の C(太い青リング、右上を開ける) */}
        <Path
          d="M50 12 A38 38 0 1 0 88 50"
          stroke={colors.primary}
          strokeWidth={11}
          strokeLinecap="round"
          fill="none"
        />
        {/* 中間の C */}
        <Path
          d="M50 28 A22 22 0 1 0 72 50"
          stroke="#6FA0F2"
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
        />
        {/* 中心の点 */}
        <Circle cx={50} cy={50} r={6} fill={colors.primaryDark} />
        {/* 赤い十字(右上) */}
        <Path d="M74 20 v18 M65 29 h18" stroke={colors.danger} strokeWidth={7} strokeLinecap="round" />
      </G>
    </Svg>
  );
}

export default BrandLogo;
