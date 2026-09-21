import React from 'react';
import { Image, View } from 'react-native';

export type DrugKey = 'amlodipine' | 'loxoprofen' | 'loratadine';

// Wikimedia Commons の実写(白背景)を assets に同梱
const IMAGES: Record<DrugKey, any> = {
  amlodipine: require('../../assets/img/amlodipine.jpg'),
  loxoprofen: require('../../assets/img/loxoprofen.jpg'),
  loratadine: require('../../assets/img/loratadine.jpg'),
};

/** カテゴリ名から薬を推定(drug 未指定時のフォールバック) */
function drugFromCategory(category: string): DrugKey {
  const c = category.toLowerCase();
  if (/鎮痛|镇痛|pain/.test(c)) return 'loxoprofen';
  if (/アレル|过敏|allerg/.test(c)) return 'loratadine';
  return 'amlodipine';
}

interface Props {
  width?: number;
  height?: number;
  drug?: DrugKey;
  category?: string;
  radius?: number;
}

/** 実際の薬の写真(白背景)。drug 指定 or category から推定。 */
export function MedImage({ width = 110, height = 78, drug, category = '', radius = 12 }: Props) {
  const key = drug ?? drugFromCategory(category);
  return (
    <View style={{ width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Image source={IMAGES[key]} style={{ width, height }} resizeMode="contain" />
    </View>
  );
}

export default MedImage;
