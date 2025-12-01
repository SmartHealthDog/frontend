import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 산책 팁 더미데이터 (20자 이내)
const WALK_TIPS = [
  '여름에는 지면 온도 확인이 필수에요!',
  '산책 후 발바닥 체크는 필수!',
  '물은 충분히 챙겨가세요!',
  '저녁 산책은 시원해요!',
  '간식으로 훈련해보세요!',
];

// 산책 기록 더미데이터
const WALK_RECORDS = [
  {
    id: 1,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.11.16',
    distance: '2.00km',
    duration: '00 : 10 : 00',
  },
  {
    id: 2,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.11.15',
    distance: '1.50km',
    duration: '00 : 08 : 30',
  },
  {
    id: 3,
    petName: '뽀삐',
    petImage: require('../assets/img_adoptDog.png'),
    date: '2025.11.14',
    distance: '3.20km',
    duration: '00 : 25 : 00',
  },
  {
    id: 4,
    petName: '나비',
    petImage: require('../assets/img_adoptCat.png'),
    date: '2025.11.13',
    distance: '1.80km',
    duration: '00 : 12 : 00',
  },
];

// 요일별 산책 그래프 더미데이터 (각 요일별 산책량)
const WEEKLY_DATA = [
  { day: '일', pet1: 30, pet2: 20 },
  { day: '월', pet1: 50, pet2: 40 },
  { day: '화', pet1: 20, pet2: 60 },
  { day: '수', pet1: 70, pet2: 30 },
  { day: '목', pet1: 40, pet2: 50 },
  { day: '금', pet1: 60, pet2: 20 },
  { day: '토', pet1: 80, pet2: 40 },
];

export default function WalkScreen() {
  // 랜덤 산책 팁 선택
  const randomTip = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * WALK_TIPS.length);
    return WALK_TIPS[randomIndex];
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
          {WEEKLY_DATA.map((item, index) => {
            const totalHeight = item.pet1 + item.pet2;
            const maxHeight = 120; // 최대 막대 높이
            const scaledTotal = (totalHeight / 120) * maxHeight;
            const scaledPet1 = (item.pet1 / totalHeight) * scaledTotal;
            const scaledPet2 = (item.pet2 / totalHeight) * scaledTotal;
            
            return (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.barSegment,
                      {
                        height: scaledPet1,
                        backgroundColor: '#6665DD',
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.barSegment,
                      {
                        height: scaledPet2,
                        backgroundColor: '#74BC8C',
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
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
            <View key={record.id} style={styles.recordCard}>
              <Image source={record.petImage} style={styles.petImage} />
              <View style={styles.recordInfo}>
                <View style={styles.petNameBadge}>
                  <Text style={styles.petNameText}>{record.petName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>산책일시</Text>
                  <Text style={styles.infoValue}>{record.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>이동거리</Text>
                  <Text style={styles.infoValue}>{record.distance}</Text>
                </View>
                <Text style={styles.durationText}>{record.duration}</Text>
              </View>
            </View>
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
    color: '#6665DD',
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
    color: '#6665DD',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
  },
});
