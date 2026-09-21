/**
 * i18n フック。t('login.title') のようなドット記法でテキストを取得。
 * {name} などのプレースホルダは第2引数で置換。
 */
import { useApp, Lang } from '../store/app';
import { translations } from './translations';

function resolve(lang: Lang, key: string): string {
  const parts = key.split('.');
  let node: any = translations[lang];
  for (const p of parts) {
    node = node?.[p];
    if (node == null) break;
  }
  if (typeof node === 'string') return node;
  // フォールバック:日本語 → キーそのもの
  let ja: any = translations.ja;
  for (const p of parts) ja = ja?.[p];
  return typeof ja === 'string' ? ja : key;
}

function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
}

export function useT() {
  const language = useApp((s) => s.language);
  return (key: string, vars?: Record<string, string | number>) => interpolate(resolve(language, key), vars);
}

/** 現在の言語コードを取得 */
export function useLang(): Lang {
  return useApp((s) => s.language);
}
