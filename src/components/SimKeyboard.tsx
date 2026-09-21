import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface Props {
  onKey: (ch: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

const ROWS_LOWER = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

/** デスクトップのプレビュー用:iOS 風のオンスクリーンキーボード(擬似) */
export function SimKeyboard({ onKey, onBackspace, onSubmit }: Props) {
  const [shift, setShift] = useState(false);
  const rows = ROWS_LOWER;

  const press = (ch: string) => { onKey(shift ? ch.toUpperCase() : ch); };

  return (
    <View style={styles.kb}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {ri === 2 && (
            <Pressable style={[styles.key, styles.special]} onPress={() => setShift((s) => !s)}>
              <Ionicons name={shift ? 'arrow-up' : 'arrow-up-outline'} size={18} color={shift ? colors.primary : colors.textPrimary} />
            </Pressable>
          )}
          {row.map((ch) => (
            <Pressable key={ch} style={styles.key} onPress={() => press(ch)}>
              <Text style={styles.keyText}>{shift ? ch.toUpperCase() : ch}</Text>
            </Pressable>
          ))}
          {ri === 2 && (
            <Pressable style={[styles.key, styles.special]} onPress={onBackspace}>
              <Ionicons name="backspace-outline" size={20} color={colors.textPrimary} />
            </Pressable>
          )}
        </View>
      ))}
      <View style={styles.row}>
        <Pressable style={[styles.key, styles.special]} onPress={() => onKey('123')}>
          <Text style={styles.smallKey}>123</Text>
        </Pressable>
        <Pressable style={[styles.key, styles.space]} onPress={() => onKey(' ')}>
          <Text style={styles.keyText}>space</Text>
        </Pressable>
        <Pressable style={[styles.key, styles.return]} onPress={onSubmit}>
          <Text style={styles.returnText}>send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kb: { backgroundColor: '#D1D5DB', paddingTop: 8, paddingBottom: 10, paddingHorizontal: 4 },
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8, gap: 5 },
  key: { minWidth: 30, height: 42, borderRadius: 6, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, flexShrink: 1,
    // @ts-ignore web shadow
    boxShadow: '0 1px 0 rgba(0,0,0,0.25)' },
  keyText: { fontSize: 17, color: colors.textPrimary },
  smallKey: { fontSize: 14, color: colors.textPrimary },
  special: { backgroundColor: '#ABB2BD' },
  space: { flex: 1, maxWidth: 180 },
  return: { backgroundColor: colors.primary, paddingHorizontal: 16 },
  returnText: { fontSize: 15, fontWeight: '700', color: colors.white },
});

export default SimKeyboard;
