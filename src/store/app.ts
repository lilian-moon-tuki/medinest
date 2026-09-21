/**
 * アプリのグローバル状態(zustand + AsyncStorage 永続化)。
 * 認証(ゲスト/ログイン)・患者・健康記録・通知・言語などを一元管理。
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'ja' | 'zh' | 'en';

export interface Patient {
  id: string;
  fullName: string;
  firstName: string;
  patientId: string;
  bloodType: string;
  avatar: string;
  birthday: string;
  gender: string;
  phone: string;
  email: string;
}

export interface VitalRecord {
  id: string;
  type: 'heartRate' | 'bloodPressure' | 'bloodSugar' | 'weight' | 'temperature' | 'steps';
  value: string;
  unit: string;
  date: string;
}

export interface NotificationSettings {
  medication: boolean;
  appointment: boolean;
  message: boolean;
  news: boolean;
}

export interface Insurance {
  bound: boolean;
  type: string;
  number: string;
}

/** 疑似バックエンドの登録アカウント */
export interface Account {
  email: string;
  password: string;
  name: string;
}

export type LoginResult = 'ok' | 'notRegistered' | 'wrongPassword';
export type SignupResult = 'ok' | 'exists';

/** 予約 1 件 */
export interface Appointment {
  id: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  doctorId: string;
  date: string;   // 表示用
  time: string;
  online: boolean;
}

/** ゲスト時に使う空のプロフィール */
export const GUEST_PATIENT: Patient = {
  id: 'guest', fullName: '', firstName: '', patientId: '', bloodType: '',
  avatar: '', birthday: '', gender: '', phone: '', email: '',
};

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces';

interface AppState {
  language: Lang;
  setLanguage: (l: Lang) => void;

  // 認証(疑似バックエンド)
  isAuthed: boolean;
  isGuest: boolean;
  accounts: Account[];
  login: (email: string, password: string) => LoginResult;
  register: (name: string, email: string, password: string) => SignupResult;
  signInGuest: () => void;
  signOut: () => void;

  // 予約
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, 'id'>) => void;
  cancelAppointment: (id: string) => void;

  // 患者
  patients: Patient[];
  currentPatientId: string;
  switchPatient: (id: string) => void;
  updatePatient: (id: string, patch: Partial<Patient>) => void;

  // 健康記録
  vitals: VitalRecord[];
  addVital: (v: Omit<VitalRecord, 'id' | 'date'> & { date?: string }) => void;

  // デバイス
  connectedDeviceIds: string[];
  toggleDevice: (id: string) => void;

  // 通知
  notifications: NotificationSettings;
  setNotification: (key: keyof NotificationSettings, value: boolean) => void;

  // 保険(要バインド)
  insurance: Insurance;
  bindInsurance: (type: string, number: string) => void;

  // 位置
  locationLabel: string | null;
  setLocationLabel: (label: string | null) => void;
}

const defaultVitals: VitalRecord[] = [
  { id: 'v1', type: 'heartRate', value: '72', unit: 'bpm', date: '2026-09-05T08:00:00Z' },
  { id: 'v2', type: 'heartRate', value: '75', unit: 'bpm', date: '2026-09-04T08:00:00Z' },
  { id: 'v3', type: 'heartRate', value: '70', unit: 'bpm', date: '2026-09-03T08:00:00Z' },
  { id: 'v4', type: 'bloodPressure', value: '118/76', unit: 'mmHg', date: '2026-09-05T08:00:00Z' },
  { id: 'v5', type: 'bloodPressure', value: '120/78', unit: 'mmHg', date: '2026-09-04T08:00:00Z' },
  { id: 'v6', type: 'bloodSugar', value: '95', unit: 'mg/dL', date: '2026-09-05T07:30:00Z' },
  { id: 'v7', type: 'bloodSugar', value: '102', unit: 'mg/dL', date: '2026-09-04T07:30:00Z' },
  { id: 'v8', type: 'weight', value: '64.5', unit: 'kg', date: '2026-09-05T07:00:00Z' },
  { id: 'v9', type: 'temperature', value: '36.4', unit: '°C', date: '2026-09-05T07:00:00Z' },
  { id: 'v10', type: 'steps', value: '8420', unit: 'steps', date: '2026-09-05T20:00:00Z' },
];

/** ログイン時に作る本人プロフィール(氏名は未設定=後で編集) */
function makePrimary(email: string, name?: string): Patient {
  return {
    id: 'p1',
    fullName: name ?? '',
    firstName: name ? name.split(/[\s　]/).pop() ?? name : '',
    patientId: 'MN-' + Date.now().toString().slice(-6),
    bloodType: '',
    avatar: DEFAULT_AVATAR,
    birthday: '',
    gender: '',
    phone: '',
    email,
  };
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      language: 'ja',
      setLanguage: (language) => set({ language }),

      isAuthed: false,
      isGuest: false,
      accounts: [{ email: 'demo@medinest.app', password: '123456', name: '佐藤 健' }],
      login: (email, password) => {
        const e = email.trim().toLowerCase();
        const acc = useApp.getState().accounts.find((a) => a.email.toLowerCase() === e);
        if (!acc) return 'notRegistered';
        if (acc.password !== password) return 'wrongPassword';
        set({ isAuthed: true, isGuest: false, patients: [makePrimary(acc.email, acc.name)], currentPatientId: 'p1' });
        return 'ok';
      },
      register: (name, email, password) => {
        const e = email.trim().toLowerCase();
        if (useApp.getState().accounts.some((a) => a.email.toLowerCase() === e)) return 'exists';
        set((s) => ({ accounts: [...s.accounts, { email: email.trim(), password, name: name.trim() }] }));
        set({ isAuthed: true, isGuest: false, patients: [makePrimary(email.trim(), name.trim())], currentPatientId: 'p1' });
        return 'ok';
      },
      signInGuest: () =>
        set({ isAuthed: true, isGuest: true, patients: [], currentPatientId: 'guest' }),
      signOut: () =>
        set({ isAuthed: false, isGuest: false, patients: [], currentPatientId: 'guest', insurance: { bound: false, type: '', number: '' } }),

      appointments: [
        { id: 'a1', status: 'upcoming', doctorId: 'da', date: '2024/05/24', time: '14:30 - 15:00', online: true },
      ],
      addAppointment: (a) => set((s) => ({ appointments: [{ ...a, id: `a${Date.now()}` }, ...s.appointments] })),
      cancelAppointment: (id) => set((s) => ({ appointments: s.appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)) })),

      patients: [],
      currentPatientId: 'guest',
      switchPatient: (currentPatientId) => set({ currentPatientId }),
      updatePatient: (id, patch) =>
        set((s) => ({ patients: s.patients.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),

      vitals: defaultVitals,
      addVital: (v) =>
        set((s) => ({
          vitals: [
            { id: `v${Date.now()}`, date: v.date ?? new Date().toISOString(), type: v.type, value: v.value, unit: v.unit },
            ...s.vitals,
          ],
        })),

      connectedDeviceIds: ['apple'],
      toggleDevice: (id) =>
        set((s) => ({
          connectedDeviceIds: s.connectedDeviceIds.includes(id)
            ? s.connectedDeviceIds.filter((d) => d !== id)
            : [...s.connectedDeviceIds, id],
        })),

      notifications: { medication: true, appointment: true, message: true, news: false },
      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),

      insurance: { bound: false, type: '', number: '' },
      bindInsurance: (type, number) => set({ insurance: { bound: true, type, number } }),

      locationLabel: null,
      setLocationLabel: (locationLabel) => set({ locationLabel }),
    }),
    {
      name: 'medinest-store-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        language: s.language,
        isAuthed: s.isAuthed,
        isGuest: s.isGuest,
        accounts: s.accounts,
        patients: s.patients,
        currentPatientId: s.currentPatientId,
        appointments: s.appointments,
        vitals: s.vitals,
        connectedDeviceIds: s.connectedDeviceIds,
        notifications: s.notifications,
        insurance: s.insurance,
        locationLabel: s.locationLabel,
      }),
    }
  )
);

/** 現在の患者(ゲスト時は空プロフィール) */
export function useCurrentPatient(): Patient {
  return useApp((s) => s.patients.find((p) => p.id === s.currentPatientId) ?? GUEST_PATIENT);
}
