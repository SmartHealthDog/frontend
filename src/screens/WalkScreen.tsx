import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type WalkRecord = {
  id: number;
  petName: string;
  petImage: any;
  date: string;
  distance: string;
  duration: string;
  startTime: string;
};

// 산책 팁 더미데이터 (20자 이내)
const WALK_TIPS = [
  '여름에는 지면 온도 확인이 필수에요!',
  '산책 후 발바닥 체크는 필수!',
  '물은 충분히 챙겨가세요!',
  '저녁 산책은 시원해요!',
  '간식으로 훈련해보세요!',
];

// 산책 기록 더미데이터
const WALK_RECORDS: WalkRecord[] = [
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
    distance: '1.50km',
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
    date: '2025.12.15', // 동일 날짜 다른 반려동물
    distance: '2.40km',
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
    distance: '3.10km',
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
    distance: '1.00km',
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
    distance: '1.50km',
    duration: '00 : 08 : 30',
    startTime: '08:15',
  },
];

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 각 반려동물의 대표 색상 (요일별 그래프와 동일하게 매핑)
const PET_COLORS: Record<string, string> = {
  '뽀삐': '#6665DD', // pet1 색상
  '나비': '#74BC8C', // pet2 색상
};

const getPetColor = (petName: string) => PET_COLORS[petName] ?? '#6665DD';
const PET_BADGE_BG_COLORS: Record<string, string> = {
  '뽀삐': '#EFF1FF',
  '나비': '#E8F6EE',
};
const getPetBadgeColor = (petName: string) => PET_BADGE_BG_COLORS[petName] ?? '#EFF1FF';

const parseDistanceKm = (distanceText: string) => {
  const numeric = parseFloat(distanceText.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const getDayLabel = (dateText: string) => {
  const normalized = dateText.replace(/\./g, '-');
  const date = new Date(normalized);
  const dayIndex = date.getDay();
  return DAYS[dayIndex] ?? '일';
};

export default function WalkScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 랜덤 산책 팁 선택
  const randomTip = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * WALK_TIPS.length);
    return WALK_TIPS[randomIndex];
  }, []);

  // 산책 기록을 기반으로 요일별 산책 그래프 데이터 생성 (거리 총합 km)
  const weeklyData = useMemo(() => {
    const totals: Record<string, { [pet: string]: number }> = {};

    DAYS.forEach((day) => {
      totals[day] = {};
    });

    WALK_RECORDS.forEach((record) => {
      const day = getDayLabel(record.date);
      const distance = parseDistanceKm(record.distance);
      totals[day][record.petName] = (totals[day][record.petName] ?? 0) + distance;
    });

    return DAYS.map((day) => ({
      day,
      pet1: totals[day]['뽀삐'] ?? 0,
      pet2: totals[day]['나비'] ?? 0,
    }));
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.titleSection}>
            <Text style={styles.titleLine}>
              <Text style={styles.titlePrimary}>오늘도 건강하</Text>
              <Text style={styles.titleHighlight}>개</Text>
            </Text>
            <Text style={styles.subtitle}>산책해 볼까요?</Text>
            <Text style={styles.tipText}>{randomTip}</Text>
          </View>
          
          {/* 산책 시작 아이콘 */}
          <View style={styles.startIconContainer}>
            <Image
              source={require('../assets/icon_startWalk.png')}
              style={styles.startIcon}
            />
          </View>
        </View>
      </View>

      {/* 요일별 산책 그래프 섹션 */}
      <View style={styles.graphSection}>
        <Text style={styles.graphTitle}>요일별 산책 그래프</Text>
        
        <View style={styles.graphContainer}>
          {weeklyData.map((item, index) => {
            const totalHeight = item.pet1 + item.pet2;
            const maxHeight = 120; // 최대 막대 높이
            const scaledTotal = totalHeight > 0 ? (totalHeight / 5) * (maxHeight / 2) : 0; // km 단위, 적당히 스케일링
            const scaledPet1 = totalHeight > 0 ? (item.pet1 / totalHeight) * scaledTotal : 0;
            const scaledPet2 = totalHeight > 0 ? (item.pet2 / totalHeight) * scaledTotal : 0;
            const hasPet1 = scaledPet1 > 0;
            const hasPet2 = scaledPet2 > 0;
            const barRadius = 4;
            
            return (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.barSegment,
                      {
                        height: scaledPet1,
                        backgroundColor: '#6665DD',
                        borderTopLeftRadius: barRadius,
                        borderTopRightRadius: barRadius,
                        borderBottomLeftRadius: hasPet2 ? 0 : barRadius,
                        borderBottomRightRadius: hasPet2 ? 0 : barRadius,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.barSegment,
                      {
                        height: scaledPet2,
                        backgroundColor: '#74BC8C',
                        borderBottomLeftRadius: barRadius,
                        borderBottomRightRadius: barRadius,
                        borderTopLeftRadius: hasPet1 ? 0 : barRadius,
                        borderTopRightRadius: hasPet1 ? 0 : barRadius,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dayText}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 하단 시트 - 산책 기록 리스트 */}
      <View style={styles.bottomSheet}>
        <ScrollView
          style={styles.recordScrollView}
          contentContainerStyle={styles.recordScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {WALK_RECORDS.map((record) => (
            <TouchableOpacity
              key={record.id}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('WalkLogDetail', { record })}
            >
              <View style={styles.recordCard}>
                <Image source={record.petImage} style={styles.petImage} />
                <View style={styles.recordInfo}>
                  <View style={[styles.petNameBadge, { backgroundColor: getPetBadgeColor(record.petName) }]}>
                    <Text style={[styles.petNameText, { color: getPetColor(record.petName) }]}>
                      {record.petName}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>산책일시</Text>
                    <Text style={styles.infoValue}>{record.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>이동거리</Text>
                    <Text style={styles.infoValue}>{record.distance}</Text>
                  </View>
                  <Text style={[styles.durationText, { color: getPetColor(record.petName) }]}>
                    {record.duration}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 48,
    marginBottom: 12,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleSection: {
    flex: 1,
  },

  titleLine: {
    fontSize: 32,
    lineHeight: 40,
  },

  titlePrimary: {
    color: '#0081D5',
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
  },

  titleHighlight: {
    color: '#FFC94D',
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 40,
  },

  subtitle: {
    color: '#000',
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    marginTop: 2,
  },

  tipText: {
    color: '#7B7C7D',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 15,
  },

  startIconContainer: {
    marginLeft: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  startIcon: {
    width: 120,
    height: 120,
  },

  graphSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },

  graphTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },

  graphContainer: {
    width: 310,
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 24,
  },

  barColumn: {
    alignItems: 'center',
    width: 20,
  },

  barWrapper: {
    width: 20,
    alignItems: 'center',
  },

  barSegment: {
    width: 20,
  },

  dayText: {
    color: '#040505',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },

  bottomSheet: {
    flex: 1,
    marginTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  recordScrollView: {
    flex: 1,
  },

  recordScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
    alignItems: 'center',
  },

  recordCard: {
    width: 340,
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECEE',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    padding: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },

  petImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  recordInfo: {
    flex: 1,
  },

  petNameBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 39,
    backgroundColor: '#EFF3FE',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },

  petNameText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  infoLabel: {
    color: '#7B7C7D',
    fontSize: 14,
    fontWeight: '600',
  },

  infoValue: {
    color: '#040505',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },

  durationText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
  },
});
