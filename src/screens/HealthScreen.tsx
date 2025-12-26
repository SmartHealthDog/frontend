import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Modal,
  Image
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import SymptomSearchBox from '../components/SymptomSearchBox';
import DiagnosisCard from '../components/DiagnosisCard';
import DropdownButton from '../components/DropdownButton';
import HospitalCard from '../components/HospitalCard';

const eyeDog = require('../assets/eyeDog.png');
const urineDog = require('../assets/urineDog.png');

const REGIONS = [
  '서울특별시', '경기도', '인천광역시', '부산광역시', '대구광역시'
];

const DISTRICTS: { [key: string]: string[] } = {
  '서울특별시': ['양천구', '강남구', '서초구', '구로구', '마포구'],
  '경기도': ['성남시', '용인시', '수원시'],
  '인천광역시': ['미추홀구', '연수구', '부평구'],
  '부산광역시': ['해운대구', '부산진구'],
  '대구광역시': ['수성구', '달서구']
};

const SORT_OPTIONS = ['거리순', '별점순', '이름순'];

const HealthScreen: React.FC = () => {

  const navigation = useNavigation<any>();  // ★ navigation 사용

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSort, setSelectedSort] = useState('거리순');

  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }} >

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.titleLine}>
          <Text style={styles.titlePrimary}>똑똑하</Text>
          <Text style={styles.titleHighlight}>개</Text>
        </Text>

        <Text style={styles.subtitle}>스마트 진단하기</Text>
      </View>
      
      <SymptomSearchBox />

      {/* ============================ */}
      {/* 진단 기능 버튼 */}
      {/* ============================ */}
      <View style={styles.cardRow}>
        
        {/* 안구질환 진단 → SymptomResult 또는 EyeScreen으로 이동 */}
        <DiagnosisCard
          title="안구질환 진단"
          description="강아지, 고양이의 안구 질환을 간단하게 진단"
          image={eyeDog}
          imageType="eye"
          onPress={() => navigation.navigate('EyeDiagnosis')}   // ★ 이동 추가
        />

        {/* 소변키트 진단 → 다른 화면으로 이동 */}
        <DiagnosisCard
          title="소변키트 진단"
          description="소변키트 촬영을 통해 10종 항목 진단"
          image={urineDog}
          imageType="urine"
          onPress={() => navigation.navigate('UrineDiagnosis')}    // ★ 이동 추가
        />

      </View>

      {/* ============================ */}
      {/* 동물병원 검색 */}
      {/* ============================ */}
      <View style={styles.whiteSection}>
        <Text style={styles.sectionTitle}>동물병원 검색</Text>

        <View style={styles.filterRow}>

          <DropdownButton label={selectedRegion || '지역'} onPress={() => setShowRegionModal(true)} />
          <DropdownButton label={selectedDistrict || '군/구'} onPress={() => selectedRegion && setShowDistrictModal(true)} disabled={!selectedRegion} />
          <DropdownButton label={selectedSort} onPress={() => setShowSortModal(true)} />

        </View>

        <View style={{ marginTop: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <HospitalCard
              key={i}
              name="ABC 동물병원"
              rating={3.4}
              address="서울시 양천구 신목로 100 2층"
              phone="02-1234-5678"
              image={require('../assets/adopt_placeholder.png')}
              onPress={() => console.log('병원 클릭')}
            />
          ))}
        </View>

      </View>

      {/* ▼ 아래 모달들은 그대로 유지 ▼ */}

      {/* 지역 선택 모달 */}
      <Modal visible={showRegionModal} transparent animationType="fade" onRequestClose={() => setShowRegionModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowRegionModal(false)}>
          <View style={styles.modalContent}>
            <ScrollView>
              {REGIONS.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedRegion(region);
                    setSelectedDistrict('');
                    setShowRegionModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{region}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 군/구 */}
      <Modal visible={showDistrictModal} transparent animationType="fade" onRequestClose={() => setShowDistrictModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDistrictModal(false)}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedRegion && DISTRICTS[selectedRegion]?.map((district) => (
                <TouchableOpacity
                  key={district}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedDistrict(district);
                    setShowDistrictModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{district}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 정렬 */}
      <Modal visible={showSortModal} transparent animationType="fade" onRequestClose={() => setShowSortModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSortModal(false)}>
          <View style={styles.modalContent}>
            {SORT_OPTIONS.map((sort) => (
              <TouchableOpacity
                key={sort}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedSort(sort);
                  setShowSortModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{sort}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
};

export default HealthScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },

  headerContainer: { paddingHorizontal: 20, paddingTop: 48, marginBottom: 12 },

  titleLine: { fontSize: 32, lineHeight: 40 },

  titlePrimary: { color: '#0081D5', fontSize: 32, fontWeight: '600', lineHeight: 40 },

  titleHighlight: { color: '#FFC94D', fontWeight: '600', fontSize: 32, lineHeight: 40 },

  subtitle: { color: '#000', fontSize: 32, fontWeight: '600', lineHeight: 40, marginTop: 2 },

  cardRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 32, justifyContent: 'space-between' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF', borderRadius: 12, width: '80%', maxHeight: '70%', paddingVertical: 10,
  },

  modalItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EAECEE' },

  modalItemText: { fontSize: 16, color: '#1F2024' },

  whiteSection: {
    backgroundColor: '#FFFFFF', marginTop: 32, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12,
  },

  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 16 },

  filterRow: { flexDirection: 'row', gap: 12 },
});
