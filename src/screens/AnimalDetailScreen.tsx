import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';

type AnimalDetailRouteProp = RouteProp<RootStackParamList, 'AnimalDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AnimalDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AnimalDetailRouteProp>();
  const { animalData } = route.params;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/icon_navBack.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo_navTop.png')}
            style={styles.logo}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 보호소 제목 */}
        <Text style={styles.shelterTitle}>밀양시 동물보호센터</Text>

        {/* 동물 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={animalData.image}
            style={styles.animalImage}
          />
        </View>

        {/* 품종 */}
        <Text style={styles.breedText}>{animalData.breed}</Text>

        {/* 상세 정보 요약 */}
        <Text style={styles.summaryText}>수컷(중성화 X) / 흰색 / 2025(년생) / 2.3(kg)</Text>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 상세 정보 */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>입양날짜</Text>
            <Text style={styles.detailValue}>17일 후 입양가능</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>공고번호</Text>
            <Text style={styles.detailValue}>경남-밀양-2025-10-10</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>공고기간</Text>
            <Text style={styles.detailValue}>2025-09-24 ~ 2025-10-10</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>발견장소</Text>
            <Text style={styles.detailValue}>{animalData.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>특이사항</Text>
            <Text style={styles.detailValue}>6마리 남매, 몸에 비해 작은얼굴이 매력적</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>보호센터</Text>
            <Text style={styles.detailValue}>밀양시 동물보호센터</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>관할기관</Text>
            <Text style={styles.detailValue}>경상남도 밀양시</Text>
          </View>
        </View>

        {/* 전화하기 버튼 */}
        <View style={styles.buttonContainer}>
          <CustomButton
            text="전화하기"
            onPress={() => {}}
            width={350}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 143,
    height: 28,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  shelterTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  animalImage: {
    width: 380,
    height: 250,
    borderRadius: 12,
  },
  breedText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginLeft: 20,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0081D5',
    marginLeft: 20,
  },
  divider: {
    width: 350,
    height: 1,
    backgroundColor: '#E4E4E4',
    alignSelf: 'center',
    marginVertical: 20,
  },
  detailsSection: {
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#7B7C7D',
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  detailValue: {
    color: '#3C4144',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 16,
  },
  buttonContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
});

