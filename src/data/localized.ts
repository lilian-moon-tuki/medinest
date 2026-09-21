/**
 * 言語対応データ。医師名・病院・診療科・薬名などを言語ごとに返す。
 * 画面は useDoctors() / useMeds() 経由で取得する。
 */
import { useLang } from '../i18n';
import { Lang } from '../store/app';

type L = Record<Lang, string>;
const pick = (l: Lang, m: L) => m[l];

export interface LDoctor {
  id: string;
  avatar: string;
  rating: number;
  online: boolean;
  hospitalId?: string;
  name: string;
  hospital: string;
  department: string;
}
export interface LMed {
  id: string;
  box: string;
  name: string;
  category: string;
  instruction: string;
  remaining: string;
  nextDose: string;
  date?: string;
}

const HOSPITAL: L = { ja: 'ゼニス総合病院', zh: '泽尼斯综合医院', en: 'Zenith General Hospital' };
const DEPT_INTERNAL: L = { ja: '内科', zh: '内科', en: 'Internal Medicine' };

// 医師名は翻訳ではなく、言語ごとに現地の名前を使用
const doctorsRaw = [
  { id: 'd1', hospitalId: 'h1', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces', rating: 4.9, online: true, name: { ja: '伊藤 さくら 医師', zh: '陈静 医生', en: 'Dr. Emily Carter' } },
  { id: 'd2', hospitalId: 'h1', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=faces', rating: 4.8, online: false, name: { ja: '山本 一 医師', zh: '王建国 医生', en: 'Dr. James Miller' } },
  { id: 'd3', hospitalId: 'h2', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces', rating: 4.9, online: true, name: { ja: '田中 大輔 医師', zh: '林浩然 医生', en: 'Dr. David Chen' } },
  { id: 'd4', hospitalId: 'h3', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=faces', rating: 4.7, online: false, name: { ja: '中村 洋平 医師', zh: '刘伟 医生', en: 'Dr. Robert Wilson' } },
];

const appointmentDoctorRaw = {
  id: 'da', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=faces',
  rating: 4.9, online: true, name: { ja: '佐藤 健一 医師', zh: '李明 医生', en: 'Dr. Michael Brown' },
};

// 実際の薬に近い標準的な画像(白背景の錠剤/PTP)
const IMG_AMLO = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=220&fit=crop';
const IMG_LOXO = 'https://images.unsplash.com/photo-1550572017-edd951aa8f7f?w=300&h=220&fit=crop';
const IMG_LORA = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=220&fit=crop';

const currentRaw = [
  {
    id: 'm1', box: IMG_AMLO,
    name: { ja: 'アムロジピン錠 5mg', zh: '氨氯地平片 5mg', en: 'Amlodipine 5mg' },
    category: { ja: '高血圧', zh: '高血压', en: 'Hypertension' },
    instruction: { ja: '1日1回朝食後に服用してください', zh: '每日1次，早餐后服用', en: 'Take once daily after breakfast' },
    remaining: { ja: '残り14日分', zh: '剩余14天量', en: '14 days left' },
    nextDose: { ja: '次回服用: 明日朝', zh: '下次服用: 明早', en: 'Next: tomorrow AM' },
  },
  {
    id: 'm2', box: IMG_LOXO,
    name: { ja: 'ロキソプロフェン錠 60mg', zh: '洛索洛芬钠片 60mg', en: 'Loxoprofen 60mg' },
    category: { ja: '鎮痛', zh: '镇痛', en: 'Pain relief' },
    instruction: { ja: '痛みがある時に1錠服用。4時間以上空けてください', zh: '疼痛时服1片，间隔4小时以上', en: 'Take 1 tablet when in pain, at least 4h apart' },
    remaining: { ja: '残り10回分', zh: '剩余10次量', en: '10 doses left' },
    nextDose: { ja: '頓服', zh: '必要时', en: 'As needed' },
  },
];

const pastRaw = [
  {
    id: 'p1', box: IMG_AMLO, date: '2023/03/22',
    name: { ja: 'アムロジピン錠 5mg', zh: '氨氯地平片 5mg', en: 'Amlodipine 5mg' },
    category: { ja: '高血圧', zh: '高血压', en: 'Hypertension' },
  },
  {
    id: 'p2', box: IMG_LOXO, date: '2023/03/22',
    name: { ja: 'ロキソプロフェン錠 60mg', zh: '洛索洛芬钠片 60mg', en: 'Loxoprofen 60mg' },
    category: { ja: '鎮痛', zh: '镇痛', en: 'Pain relief' },
  },
  {
    id: 'p3', box: IMG_LORA, date: '2024/05/13',
    name: { ja: 'ロラタジン錠 10mg', zh: '氯雷他定片 10mg', en: 'Loratadine 10mg' },
    category: { ja: 'アレルギー', zh: '过敏', en: 'Allergy' },
  },
];

export function useDoctors(hospitalId?: string): LDoctor[] {
  const l = useLang();
  return doctorsRaw
    .filter((d) => !hospitalId || d.hospitalId === hospitalId)
    .map((d) => ({ id: d.id, avatar: d.avatar, rating: d.rating, online: d.online, hospitalId: d.hospitalId, name: pick(l, d.name), hospital: pick(l, HOSPITAL), department: pick(l, DEPT_INTERNAL) }));
}

export function useAppointmentDoctor(): LDoctor {
  const l = useLang();
  return { id: appointmentDoctorRaw.id, avatar: appointmentDoctorRaw.avatar, rating: appointmentDoctorRaw.rating, online: appointmentDoctorRaw.online, name: pick(l, appointmentDoctorRaw.name), hospital: pick(l, HOSPITAL), department: pick(l, DEPT_INTERNAL) };
}

export function useCurrentMeds(): LMed[] {
  const l = useLang();
  return currentRaw.map((m) => ({ id: m.id, box: m.box, name: pick(l, m.name), category: pick(l, m.category), instruction: pick(l, m.instruction), remaining: pick(l, m.remaining), nextDose: pick(l, m.nextDose) }));
}

export function usePastMeds(): LMed[] {
  const l = useLang();
  return pastRaw.map((m) => ({ id: m.id, box: m.box, name: pick(l, m.name), category: pick(l, m.category), instruction: '', remaining: '', nextDose: '', date: m.date }));
}

export function useMedById(id?: string): LMed | undefined {
  const cur = useCurrentMeds();
  const past = usePastMeds();
  return [...cur, ...past].find((m) => m.id === id);
}

export type SpecialtyTag = 'internal' | 'pediatrics' | 'dental';
export interface LClinic {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  waiting: number;
  department: string;
  tags: SpecialtyTag[];
}

const clinicsRaw: { id: string; distanceKm: number; waiting: number; tags: SpecialtyTag[]; name: L; address: L; department: L }[] = [
  { id: 'c1', distanceKm: 0.8, waiting: 3, tags: ['internal'], name: { ja: 'クラウドクリニック', zh: '云端诊所', en: 'Cloud Clinic' }, address: { ja: '京都市右京区西院巽町40-3', zh: '京都市右京区西院巽町40-3', en: '40-3 Saiin, Ukyo-ku, Kyoto' }, department: { ja: '一般内科', zh: '普通内科', en: 'Internal Medicine' } },
  { id: 'c2', distanceKm: 1.2, waiting: 1, tags: ['internal', 'pediatrics'], name: { ja: '御池メディカル', zh: '御池医疗中心', en: 'Oike Medical' }, address: { ja: '京都市中京区御池通', zh: '京都市中京区御池通', en: 'Oike-dori, Nakagyo-ku, Kyoto' }, department: { ja: '内科・小児科', zh: '内科・儿科', en: 'Internal & Pediatrics' } },
  { id: 'c3', distanceKm: 1.9, waiting: 5, tags: ['dental'], name: { ja: 'にじいろ歯科', zh: '彩虹牙科', en: 'Nijiiro Dental' }, address: { ja: '京都市中京区二条', zh: '京都市中京区二条', en: 'Nijo, Nakagyo-ku, Kyoto' }, department: { ja: '歯科', zh: '牙科', en: 'Dental' } },
  { id: 'c4', distanceKm: 2.3, waiting: 2, tags: ['pediatrics'], name: { ja: 'すこやかこどもクリニック', zh: '健康儿童诊所', en: 'Sukoyaka Kids Clinic' }, address: { ja: '京都市上京区今出川', zh: '京都市上京区今出川', en: 'Imadegawa, Kamigyo-ku, Kyoto' }, department: { ja: '小児科', zh: '儿科', en: 'Pediatrics' } },
  { id: 'c5', distanceKm: 2.8, waiting: 0, tags: ['internal'], name: { ja: '鴨川内科クリニック', zh: '鸭川内科诊所', en: 'Kamogawa Internal Clinic' }, address: { ja: '京都市左京区川端通', zh: '京都市左京区川端通', en: 'Kawabata-dori, Sakyo-ku, Kyoto' }, department: { ja: '一般内科', zh: '普通内科', en: 'Internal Medicine' } },
  { id: 'c6', distanceKm: 3.1, waiting: 4, tags: ['dental'], name: { ja: 'デンタルオフィス京', zh: '京牙科诊所', en: 'Dental Office Kyo' }, address: { ja: '京都市下京区四条', zh: '京都市下京区四条', en: 'Shijo, Shimogyo-ku, Kyoto' }, department: { ja: '歯科・矯正', zh: '牙科・正畸', en: 'Dental & Ortho' } },
];

export function useClinics(tag?: SpecialtyTag): LClinic[] {
  const l = useLang();
  return clinicsRaw
    .filter((c) => !tag || c.tags.includes(tag))
    .map((c) => ({ id: c.id, distanceKm: c.distanceKm, waiting: c.waiting, tags: c.tags, name: pick(l, c.name), address: pick(l, c.address), department: pick(l, c.department) }));
}

/** 過去の受診(概要ページ用) */
export function usePastVisits() {
  const l = useLang();
  const dept1: L = { ja: '一般内科', zh: '普通内科', en: 'General Internal Medicine' };
  const dept2: L = { ja: '皮膚科外来', zh: '皮肤科门诊', en: 'Dermatology' };
  const dept3: L = { ja: '予防接種（インフルエンザ）', zh: '预防接种（流感）', en: 'Vaccination (Influenza)' };
  const doc1: L = { ja: '山内 美咲 医師', zh: '赵敏 医生', en: 'Dr. Lisa Wong' };
  const doc2: L = { ja: '北村 卓也 医師', zh: '孙强 医生', en: 'Dr. Mark Taylor' };
  const clinic: L = { ja: '中央総合クリニック', zh: '中央综合诊所', en: 'Central Clinic' };
  const cancelNote: L = { ja: '患者都合によるキャンセル', zh: '因患者原因取消', en: 'Cancelled by patient' };
  return [
    { id: '1', status: 'completed' as const, dept: pick(l, dept1), doctor: pick(l, doc1), date: '2024.04.12' },
    { id: '2', status: 'cancelled' as const, dept: pick(l, dept2), doctor: pick(l, doc2), date: '2024.03.15', note: pick(l, cancelNote) },
    { id: '3', status: 'completed' as const, dept: pick(l, dept3), doctor: pick(l, clinic), date: '2024.04.12' },
  ];
}
