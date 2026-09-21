import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  height: number;
  style?: ViewStyle;
  onPress?: () => void; // フリップの代わりに押下処理をしたい場合(ゲスト等)
  disabled?: boolean;
}

/** タップで Y 軸回転する表裏カード */
export function FlipCard({ front, back, height, style, onPress, disabled }: FlipCardProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const flip = () => {
    if (onPress) return onPress();
    if (disabled) return;
    const to = flipped ? 0 : 1;
    setFlipped(!flipped);
    Animated.timing(anim, { toValue: to, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start();
  };

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <Pressable onPress={flip} style={[{ height }, style]}>
      <Animated.View style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}>
        {front}
      </Animated.View>
      <Animated.View style={[styles.face, styles.back, { transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}>
        {back}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  face: { width: '100%', height: '100%', backfaceVisibility: 'hidden' },
  back: { position: 'absolute', top: 0, left: 0 },
});

export default FlipCard;
