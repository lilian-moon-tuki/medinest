/**
 * モックデータ。後で Supabase のクエリに差し替える前提で、
 * 画面はここ経由でデータを受け取る。
 */

export interface Doctor {
  id: string;
  name: string;
  hospital: string;
  department: string;
  rating: number;
  online: boolean;
  avatar: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  category: string;
  categoryTone: 'green';
  instruction: string;
  remaining: string;
  nextDose: string;
  box: string;
  date?: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  waiting: number;
  department: string;
}

export const currentUser = {
  firstName: '健太',
  fullName: '佐藤 健',
  patientId: '9865-864',
  bloodType: 'A Rh+',
  insurance: '国民健康保険',
  heartRate: 72,
  bloodPressure: '118/76',
  condition: '体調良い',
  avatar:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
};

export const doctors: Doctor[] = [
  {
    id: 'd1',
    name: '伊藤 介 医師',
    hospital: 'ゼニス総合病院',
    department: '内科',
    rating: 4.9,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'd2',
    name: '山本 一 医師',
    hospital: 'ゼニス総合病院',
    department: '内科',
    rating: 4.9,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'd3',
    name: '田中 真由 医師',
    hospital: 'ゼニス総合病院',
    department: '内科',
    rating: 4.9,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces',
  },
  {
    id: 'd4',
    name: '山本 浩二 医師',
    hospital: 'ゼニス総合病院',
    department: '内科',
    rating: 4.9,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=faces',
  },
];

export const currentMeds: Medication[] = [
  {
    id: 'm1',
    name: 'アムロジピン錠 5mg',
    dose: '5mg',
    category: '高血圧',
    categoryTone: 'green',
    instruction: '1日1回朝食後に服用してください',
    remaining: '残り14日分',
    nextDose: '次回服用: 明日朝',
    box: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
  },
  {
    id: 'm2',
    name: 'ロキソプロフェン錠 60mg',
    dose: '60mg',
    category: '鎮痛',
    categoryTone: 'green',
    instruction: '痛みがある時に1錠服用してください。4時間以上空けてください',
    remaining: '残り10回分',
    nextDose: '頓服',
    box: 'https://images.unsplash.com/photo-1550572017-edd951aa8f7f?w=200&h=200&fit=crop',
  },
];

export const pastMeds: Medication[] = [
  {
    id: 'p1',
    name: 'アムロジピン錠 5mg',
    dose: '5mg',
    category: '高血圧',
    categoryTone: 'green',
    instruction: '',
    remaining: '',
    nextDose: '',
    date: '2023年3月22日',
    box: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
  },
  {
    id: 'p2',
    name: 'ロキソプロフェン錠 60mg',
    dose: '60mg',
    category: '鎮痛',
    categoryTone: 'green',
    instruction: '',
    remaining: '',
    nextDose: '',
    date: '2023年3月22日',
    box: 'https://images.unsplash.com/photo-1550572017-edd951aa8f7f?w=200&h=200&fit=crop',
  },
  {
    id: 'p3',
    name: 'ロラタジン錠 10mg',
    dose: '10mg',
    category: 'アレルギー',
    categoryTone: 'green',
    instruction: '',
    remaining: '',
    nextDose: '',
    date: '2024年5月13日',
    box: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop',
  },
];

export const clinics: Clinic[] = [
  { id: 'c1', name: 'クラウドクリニック', address: '京都府京都市右京区西院巽町40-3', distanceKm: 0.8, waiting: 3, department: '一般内科' },
  { id: 'c2', name: '御池メディカル', address: '京都府京都市中京区御池通', distanceKm: 1.2, waiting: 1, department: '内科・小児科' },
  { id: 'c3', name: 'にじいろ歯科', address: '京都府京都市中京区二条', distanceKm: 1.9, waiting: 5, department: '歯科' },
];

export const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'];

export const connectedDevices = [
  { id: 'apple', name: 'Apple ヘルスケア', status: '5分前に同期', connected: true, color: '#FF4B5C' },
  { id: 'googlefit', name: 'Google Fit', status: '未連携', connected: false, color: '#4285F4' },
  { id: 'omron', name: 'OMRON connect', status: '未連携', connected: false, color: '#0B4DA2' },
];
