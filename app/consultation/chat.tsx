import React, { useState, useRef } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadows } from '../../src/theme';
import { useDoctors } from '../../src/data/localized';
import { noOutline } from '../../src/components/SearchBar';
import { SimKeyboard } from '../../src/components/SimKeyboard';
import { useT } from '../../src/i18n';

const IS_WEB = Platform.OS === 'web';

interface Msg { id: string; from: 'me' | 'doctor'; text: string }

export default function ChatScreen() {
  const t = useT();
  const doctor = useDoctors()[0];
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', from: 'doctor', text: t('chat.welcome') },
  ]);
  const [text, setText] = useState('');
  const [kbVisible, setKbVisible] = useState(IS_WEB); // Web プレビューでは擬似キーボードを表示
  const listRef = useRef<FlatList>(null);

  const send = () => {
    if (!text.trim()) return;
    const mine: Msg = { id: `m${Date.now()}`, from: 'me', text: text.trim() };
    setMessages((prev) => [...prev, mine]);
    setText('');
    // 医師の自動返信(デモ)
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `d${Date.now()}`, from: 'doctor', text: '承知しました。もう少し詳しく教えていただけますか？' }]);
      listRef.current?.scrollToEnd({ animated: true });
    }, 900);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
        <Image source={{ uri: doctor.avatar }} style={styles.headAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.headName}>{doctor.name}</Text>
          <Text style={styles.headStatus}>{t('common.online')}</Text>
        </View>
        <Pressable style={styles.videoBtn} onPress={() => router.replace('/consultation/call')}>
          <Ionicons name="videocam" size={18} color={colors.white} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.bubbleRow, item.from === 'me' ? styles.rowMe : styles.rowDoctor]}>
              {item.from === 'doctor' && <Image source={{ uri: doctor.avatar }} style={styles.bubbleAvatar} />}
              <View style={[styles.bubble, item.from === 'me' ? styles.bubbleMe : styles.bubbleDoctor]}>
                <Text style={[styles.bubbleText, item.from === 'me' && { color: colors.white }]}>{item.text}</Text>
              </View>
            </View>
          )}
        />

        {/* 入力欄 */}
        <View style={styles.inputBar}>
          <Pressable style={styles.attach}>
            <Ionicons name="attach" size={22} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            style={[styles.input, noOutline]}
            autoFocus
            placeholder={t('chat.placeholder')}
            placeholderTextColor={colors.textTertiary}
            value={text}
            onChangeText={setText}
            onFocus={() => IS_WEB && setKbVisible(true)}
            onSubmitEditing={send}
          />
          <Pressable style={styles.send} onPress={send}>
            <Ionicons name="send" size={20} color={colors.white} />
          </Pressable>
        </View>

        {/* Web プレビュー用の擬似キーボード */}
        {IS_WEB && kbVisible && (
          <SimKeyboard
            onKey={(ch) => { if (ch.length === 1) setText((v) => v + ch); }}
            onBackspace={() => setText((v) => v.slice(0, -1))}
            onSubmit={send}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardMuted },
  headName: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  headStatus: { fontSize: 13, color: colors.success, fontWeight: '600' },
  videoBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },

  list: { padding: spacing.xl, gap: spacing.md },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.md, maxWidth: '82%' },
  rowMe: { alignSelf: 'flex-end' },
  rowDoctor: { alignSelf: 'flex-start' },
  bubbleAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.cardMuted },
  bubble: { flexShrink: 1, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  bubbleMe: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleDoctor: { backgroundColor: colors.cardMuted, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, color: colors.textPrimary, lineHeight: 21 },

  inputBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  attach: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardMuted, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, backgroundColor: colors.cardMuted, borderRadius: radius.pill, paddingHorizontal: spacing.lg, height: 46, fontSize: 15, color: colors.textPrimary },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...(shadows.floating as object) },
});
