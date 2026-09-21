import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadows } from '../theme';

/** Web のフォーカス時の青いアウトラインを消す */
export const noOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as any) : null;

export interface Suggestion {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface SearchBarProps {
  placeholder?: string;
  style?: ViewStyle;
  suggestions?: Suggestion[];
}

export function SearchBar({ placeholder = 'Search', style, suggestions = [] }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);

  const filtered = query.trim()
    ? suggestions.filter((s) => s.label.toLowerCase().includes(query.trim().toLowerCase()))
    : suggestions.slice(0, 4);
  const showList = focused && filtered.length > 0;

  // Web の音声入力(Web Speech API)
  const startVoice = () => {
    if (Platform.OS !== 'web') return;
    const SR = (globalThis as any).webkitSpeechRecognition || (globalThis as any).SpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'ja-JP';
    rec.interimResults = false;
    rec.onresult = (e: any) => { setQuery(e.results[0][0].transcript); setFocused(true); };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <View style={[{ zIndex: 20 }, style]}>
      <View style={styles.wrap}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, noOutline]}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
        <Pressable hitSlop={8} onPress={startVoice}>
          <Ionicons name={listening ? 'mic' : 'mic-outline'} size={20} color={listening ? colors.danger : colors.textSecondary} />
        </Pressable>
      </View>

      {showList && (
        <View style={styles.dropdown}>
          {filtered.map((s, i) => (
            <Pressable key={i} style={[styles.item, i > 0 && styles.itemBorder]} onPress={() => { setQuery(''); setFocused(false); s.onPress(); }}>
              <Ionicons name={s.icon ?? 'search'} size={18} color={colors.textSecondary} />
              <Text style={styles.itemText}>{s.label}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 'auto' }} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardMuted,
    borderRadius: radius.pill, paddingHorizontal: spacing.lg, height: 52, ...(shadows.soft as object),
  },
  input: { flex: 1, marginHorizontal: spacing.md, fontSize: 16, color: colors.textPrimary },
  dropdown: {
    position: 'absolute', top: 58, left: 0, right: 0, backgroundColor: colors.white,
    borderRadius: radius.lg, paddingVertical: spacing.xs, ...(shadows.card as object),
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  itemText: { fontSize: 15, color: colors.textPrimary, fontWeight: '600' },
});

export default SearchBar;
