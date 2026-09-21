import { Redirect } from 'expo-router';
import { useApp } from '../src/store/app';

/** 認証状態に応じて振り分け。 */
export default function Index() {
  const isAuthed = useApp((s) => s.isAuthed);
  return <Redirect href={isAuthed ? '/home' : '/login'} />;
}
