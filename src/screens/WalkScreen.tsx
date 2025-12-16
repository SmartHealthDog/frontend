import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Modal, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';
import {
  WALK_RECORDS_THIS_WEEK as WALK_RECORDS,
  PET_COLORS,
  PET_BADGE_BG_COLORS,
  getPetColor,
  getPetBadgeColor,
  parseDistanceKm,
} from '../data/walkRecords';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const WALK_SHEET_HEIGHT = 420;

// 산책 팁 더미데이터 (20자 이내)
const WALK_TIPS = [
  '여름에는 지면 온도 확인이 필수에요! 🔥',
  '산책 후 발바닥 체크는 꼭! 🐾',
  '물은 충분히 챙겨가세요! 💦',
  '저녁 산책은 시원하답니다! ⭐️',
  '간식으로 훈련해보세요! 🍖',
];

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const getDayLabel = (dateText: string) => {
  const normalized = dateText.replace(/\./g, '-');
  const date = new Date(normalized);
  const dayIndex = date.getDay();
  return DAYS[dayIndex] ?? '일';
};

export default function WalkScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const bottomSheetY = useRef(new Animated.Value(WALK_SHEET_HEIGHT)).current;
  const [randomTip, setRandomTip] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WALK_TIPS.length);
    return WALK_TIPS[randomIndex];
  });

  const refreshTip = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WALK_TIPS.length);
    setRandomTip(WALK_TIPS[randomIndex]);
  }, []);

  // 화면 재진입 시마다 팁 새로고침
  useFocusEffect(
    useCallback(() => {
      refreshTip();
    }, [refreshTip])
  );

  const petOptions = useMemo(() => {
    const petMap = new Map<string, any>();
    WALK_RECORDS.forEach((record) => {
      if (!petMap.has(record.petName)) {
        petMap.set(record.petName, record.petImage);
      }
    });
    return Array.from(petMap.entries()).map(([name, image]) => ({ name, image }));
  }, []);

  const openBottomSheet = () => {
    setSelectedPet(null);
    setBottomSheetVisible(true);
    bottomSheetY.setValue(WALK_SHEET_HEIGHT);
    Animated.spring(bottomSheetY, {
      toValue: 0,
      useNativeDriver: false,
      tension: 50,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetY, {
      toValue: WALK_SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setBottomSheetVisible(false);
    });
  };

  const handleStartWalk = () => {
    const pet = petOptions.find((p) => p.name === selectedPet);
    if (!pet) return;
    closeBottomSheet();
    navigation.navigate('WalkActive', { petName: pet.name, petImage: pet.image });
  };

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
          <TouchableOpacity style={styles.startIconContainer} activeOpacity={0.8} onPress={openBottomSheet}>
            <Image source={require('../assets/icon_startWalk.png')} style={styles.startIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 요일별 산책 그래프 섹션 */}
      <View style={styles.graphSection}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>요일별 산책 그래프</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('WalkWeeklyReport')}>
            <Image source={require('../assets/btn_more.png')} style={styles.graphMoreButton} />
          </TouchableOpacity>
        </View>
        
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

      {/* 산책 시작 바텀시트 */}
      <Modal visible={isBottomSheetVisible} transparent animationType="none" onRequestClose={closeBottomSheet}>
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={styles.bottomSheetBackground} activeOpacity={1} onPress={closeBottomSheet} />
          <Animated.View
            style={[
              styles.selectionSheetContainer,
              {
                transform: [{ translateY: bottomSheetY }],
              },
            ]}
          >
            <View style={styles.dragHandleArea}>
              <View style={styles.dragHandle} />
            </View>

            <View style={styles.selectionSheetContent}>
              <Text style={styles.sheetTitle}>산책할 반려동물을 선택해주세요</Text>

              <View style={styles.petCardsRow}>
                {petOptions.map((pet, index) => {
                  const isLast = index === petOptions.length - 1;
                  const isSelected = selectedPet === pet.name;
                  return (
                    <TouchableOpacity
                      key={pet.name}
                      activeOpacity={0.9}
                      onPress={() => setSelectedPet(pet.name)}
                      style={[
                        styles.petCard,
                        !isLast && styles.petCardGap,
                        isSelected && styles.petCardSelected,
                      ]}
                    >
                      <Image source={pet.image} style={styles.petCardImage} />
                      <Text style={styles.petCardName}>{pet.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.selectionButtonContainer}>
                <CustomButton text="산책하기" onPress={handleStartWalk} disabled={!selectedPet} width={350} />
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
    fontFamily: undefined,
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

  graphHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  graphTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },

  graphMoreButton: {
    width: 56,
    height: 30,
    resizeMode: 'contain',
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

  bottomSheetOverlay: {
    flex: 1,
  },
  bottomSheetBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
  selectionSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: WALK_SHEET_HEIGHT,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  dragHandleArea: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    paddingTop: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#B3B6B8',
    borderRadius: 2,
  },
  selectionSheetContent: {
    paddingHorizontal: 20,
  },
  sheetTitle: {
    marginTop: 35,
    color: '#000',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  petCardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  petCard: {
    width: 167,
    height: 170,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECEE',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  petCardGap: {
    marginRight: 16,
  },
  petCardSelected: {
    borderColor: '#0081D5',
    backgroundColor: '#EEF7FD',
  },
  petCardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  petCardName: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  selectionButtonContainer: {
    alignItems: 'center',
  },
});
