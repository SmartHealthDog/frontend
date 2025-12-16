import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import {
  WALK_RECORDS_THIS_WEEK,
  WALK_RECORDS_LAST_WEEK,
  WALK_RECORDS_ALL,
  getPetColor,
  parseDistanceKm,
  parseDurationSeconds,
} from '../data/walkRecords';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const formatTotalDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

const getDayLabel = (dateText: string) => {
  const normalized = dateText.replace(/\./g, '-');
  const date = new Date(normalized);
  const dayIndex = date.getDay();
  return DAYS[dayIndex] ?? '일';
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WalkWeeklyReportScreen() {
  const navigation = useNavigation<NavigationProp>();

  const petOptions = useMemo(() => {
    const map = new Map<string, any>();
    WALK_RECORDS_ALL.forEach((r) => {
      if (!map.has(r.petName)) {
        map.set(r.petName, r.petImage);
      }
    });
    return Array.from(map.entries()).map(([name, image]) => ({ name, image }));
  }, []);

  const [selectedPet, setSelectedPet] = useState(petOptions[0]?.name ?? '');

  const selectedRecords = useMemo(
    () => WALK_RECORDS_THIS_WEEK.filter((r) => r.petName === selectedPet),
    [selectedPet]
  );

  const lastWeekRecords = useMemo(
    () => WALK_RECORDS_LAST_WEEK.filter((r) => r.petName === selectedPet),
    [selectedPet]
  );

  const petTotals = useMemo(() => {
    const totalCount = selectedRecords.length;
    const totalDistance = selectedRecords.reduce((sum, r) => sum + parseDistanceKm(r.distance), 0);
    const totalDurationSec = selectedRecords.reduce((sum, r) => sum + parseDurationSeconds(r.duration), 0);
    return {
      totalCount,
      totalDistance: totalDistance.toFixed(1),
      totalDurationText: formatTotalDuration(totalDurationSec),
    };
  }, [selectedRecords]);

  const weeklyChange = useMemo(() => {
    const current = selectedRecords.reduce((sum, r) => sum + parseDistanceKm(r.distance), 0);
    const previous = lastWeekRecords.reduce((sum, r) => sum + parseDistanceKm(r.distance), 0);
    if (previous === 0 && current === 0) {
      return { percent: 0, isIncrease: false };
    }
    if (previous === 0) {
      return { percent: 100, isIncrease: true };
    }
    const diff = current - previous;
    const percent = Math.round(Math.abs((diff / previous) * 100));
    return { percent, isIncrease: diff >= 0 };
  }, [selectedRecords, lastWeekRecords]);

  const weeklyData = useMemo(() => {
    const totals: Record<string, number> = {};
    DAYS.forEach((d) => {
      totals[d] = 0;
    });
    selectedRecords.forEach((record) => {
      const day = getDayLabel(record.date);
      const distance = parseDistanceKm(record.distance);
      totals[day] = (totals[day] ?? 0) + distance;
    });
    return DAYS.map((day) => ({
      day,
      value: totals[day] ?? 0,
    }));
  }, [selectedRecords]);

  const selectedColor = getPetColor(selectedPet);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icon_navBack.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.headerTitle}>이번주 산책 리포트</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 반려동물 선택 리스트 */}
        <View style={styles.petSelector}>
          {petOptions.map((pet, index) => {
            const isSelected = pet.name === selectedPet;
            return (
              <TouchableOpacity
                key={pet.name}
                onPress={() => setSelectedPet(pet.name)}
                activeOpacity={0.8}
                style={[styles.petCircleWrapper, index !== petOptions.length - 1 && styles.petCircleGap]}
              >
                <Image
                  source={pet.image}
                  style={[
                    styles.petCircle,
                    {
                      borderColor: isSelected ? getPetColor(pet.name) : '#FFF',
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 산책 기록 카드 */}
        <View style={[styles.card, styles.cardRecord]}>
          <Text style={styles.cardTitle}>{selectedPet}의 산책 기록</Text>

          <View style={styles.cardPetImageWrapper}>
            {selectedRecords[0] && (
              <Image source={selectedRecords[0].petImage} style={styles.cardPetImage} />
            )}
            {!selectedRecords[0] && petOptions[0] && (
              <Image source={petOptions[0].image} style={styles.cardPetImage} />
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statItem, styles.statItemGap]}>
              <Text style={styles.statLabel}>총 횟수(회)</Text>
              <Text style={styles.statValue}>{petTotals.totalCount}</Text>
            </View>
            <View style={[styles.statItem, styles.statItemGap]}>
              <Text style={styles.statLabel}>총 거리(km)</Text>
              <Text style={styles.statValue}>{petTotals.totalDistance}km</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>총 시간</Text>
              <Text style={styles.statValue}>{petTotals.totalDurationText}</Text>
            </View>
          </View>
        </View>

        {/* 지난주 대비 그래프 카드 */}
        <View style={[styles.card, styles.cardGraph]}>
          <Text style={styles.cardTitle}>
            지난 주에 비해{'\n'}
            산책량이 <Text style={styles.highlightText}>{weeklyChange.percent}%</Text>{' '}
            {weeklyChange.isIncrease ? '증가했어요.' : '감소했어요.'}
          </Text>

          <View style={styles.graphContainer}>
            {weeklyData.map((item, index) => {
              const maxHeight = 120;
              const scaledHeight = item.value > 0 ? (item.value / 5) * (maxHeight / 2) : 0;
              const barRadius = 4;
              return (
                <View key={index} style={styles.barColumn}>
                  <View
                    style={[
                      styles.barSegmentSingle,
                      {
                        height: scaledHeight,
                        backgroundColor: selectedColor,
                        borderTopLeftRadius: barRadius,
                        borderTopRightRadius: barRadius,
                        borderBottomLeftRadius: barRadius,
                        borderBottomRightRadius: barRadius,
                      },
                    ]}
                  />
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#F3F4F5',
  },
  backButton: {
    padding: 8,
    marginRight: 0,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 8,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#1F2024',
    textAlign: 'left',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  petSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 20,
  },
  petCircleWrapper: {
    borderRadius: 34,
  },
  petCircleGap: {
    marginRight: 12,
  },
  petCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
  },
  card: {
    width: 350,
    minHeight: 248,
    alignSelf: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 24,
    shadowColor: 'rgba(52, 52, 52, 0.04)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 2,
  },
  cardRecord: {
    marginTop: 24,
  },
  cardGraph: {
    minHeight: 268,
    height: 268,
    marginTop: 32,
  },
  cardTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  cardPetImageWrapper: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'column',
    flex: 1,
  },
  statItemGap: {
    marginRight: 24,
  },
  statLabel: {
    color: '#7B7C7D',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  statValue: {
    color: '#3C4144',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  highlightText: {
    color: '#0081D5',
  },
  graphContainer: {
    width: '100%',
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  barColumn: {
    alignItems: 'center',
    width: 24,
  },
  barSegmentSingle: {
    width: 20,
  },
  dayText: {
    color: '#040505',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});

