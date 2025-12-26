export type WalkRecord = {
  id: number;
  petName: string;
  petImage: any;
  date: string;
  distance: string;
  duration: string;
  startTime?: string;
  endTime?: string;
};

export const PET_COLORS: Record<string, string> = {
  '뽀삐': '#6665DD',
  '나비': '#74BC8C',
};

export const PET_BADGE_BG_COLORS: Record<string, string> = {
  '뽀삐': '#EFF1FF',
  '나비': '#E8F6EE',
};

export const getPetColor = (petName: string) => PET_COLORS[petName] ?? '#6665DD';
export const getPetBadgeColor = (petName: string) => PET_BADGE_BG_COLORS[petName] ?? '#EFF1FF';

export const parseDistanceKm = (distanceText: string) => {
  const numeric = parseFloat(distanceText.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

export const parseDurationSeconds = (duration: string) => {
  const cleaned = duration.replace(/\s/g, '');
  const [h = '0', m = '0', s = '0'] = cleaned.split(':');
  const hours = parseInt(h, 10) || 0;
  const minutes = parseInt(m, 10) || 0;
  const seconds = parseInt(s, 10) || 0;
  return hours * 3600 + minutes * 60 + seconds;
};

export const WALK_RECORDS_THIS_WEEK: WalkRecord[] = [
  {
    id: 1,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.12.16',
    distance: '2.00km',
    duration: '00 : 10 : 00',
    startTime: '09:00',
  },
  {
    id: 2,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.12.16',
    distance: '0.80km',
    duration: '00 : 08 : 30',
    startTime: '19:20',
  },
  {
    id: 3,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.12.15',
    distance: '3.20km',
    duration: '00 : 25 : 00',
    startTime: '07:30',
  },
  {
    id: 4,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.12.15',
    distance: '0.90km',
    duration: '00 : 18 : 00',
    startTime: '20:10',
  },
  {
    id: 5,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.12.14',
    distance: '1.80km',
    duration: '00 : 12 : 00',
    startTime: '06:50',
  },
  {
    id: 6,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.12.14',
    distance: '0.70km',
    duration: '00 : 25 : 00',
    startTime: '18:00',
  },
  {
    id: 7,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.12.13',
    distance: '2.20km',
    duration: '00 : 20 : 30',
    startTime: '05:40',
  },
  {
    id: 8,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.12.12',
    distance: '0.60km',
    duration: '00 : 09 : 00',
    startTime: '21:10',
  },
  {
    id: 9,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.12.11',
    distance: '4.70km',
    duration: '00 : 39 : 30',
    startTime: '17:05',
  },
  {
    id: 10,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.12.10',
    distance: '0.50km',
    duration: '00 : 08 : 30',
    startTime: '08:15',
  },
];

export const WALK_RECORDS_LAST_WEEK: WalkRecord[] = [
  {
    id: 11,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.12.09',
    distance: '2.50km',
    duration: '00 : 22 : 00',
    startTime: '08:20',
  },
  {
    id: 12,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.12.08',
    distance: '3.60km',
    duration: '00 : 28 : 00',
    startTime: '07:40',
  },
  {
    id: 13,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.12.09',
    distance: '2.20km',
    duration: '00 : 09 : 00',
    startTime: '19:10',
  },
  {
    id: 14,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.12.08',
    distance: '2.40km',
    duration: '00 : 10 : 30',
    startTime: '20:00',
  },
];

export const WALK_RECORDS_ALL: WalkRecord[] = [...WALK_RECORDS_THIS_WEEK, ...WALK_RECORDS_LAST_WEEK];


