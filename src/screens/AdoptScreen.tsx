import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';

type TabType = '보호소 소개' | '입양 홍보';

// 지역 데이터
const REGIONS = [
  '서울특별시',
  '부산광역시',
  '인천광역시',
  '대구광역시',
  '대전광역시',
  '광주광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '충청북도',
  '충청남도',
  '전라남도',
  '경상북도',
  '경상남도',
  '강원특별자치도',
  '전북특별자치도',
  '제주특별자치도',
];

// 군/구 데이터 (현재는 서울특별시만)
const DISTRICTS: { [key: string]: string[] } = {
  '서울특별시': [
    '종로구',
    '중구',
    '용산구',
    '성동구',
    '광진구',
    '동대문구',
    '중랑구',
    '성북구',
    '강북구',
    '도봉구',
    '노원구',
    '은평구',
    '서대문구',
    '마포구',
    '양천구',
    '강서구',
    '구로구',
    '금천구',
    '영등포구',
    '동작구',
    '관악구',
    '서초구',
    '강남구',
    '송파구',
    '강동구',
  ],
};

// 반려동물 타입 데이터
const PET_TYPES = ['모두', '강아지', '고양이'];

export default function AdoptScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('보호소 소개');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState<string>('모두');
  const [showPetTypeModal, setShowPetTypeModal] = useState(false);

  // 화면이 포커스될 때마다 선택 내용 초기화
  useFocusEffect(
    useCallback(() => {
      setSelectedRegion('');
      setSelectedDistrict('');
      setSelectedPetType('모두');
    }, [])
  );

  // 지역 선택에 따른 재검색 버튼 간격 계산
  const getRefreshButtonMargin = () => {
    const textLength = selectedRegion.length;
    if (textLength >= 5) {
      return 100;
    } else if (textLength >= 3) {
      return 140;
    } else {
      return 150; // 기본값 (선택 안 됨 or 2글자 이하)
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <Header />

      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('보호소 소개')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === '보호소 소개' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            보호소 소개
          </Text>
          <View
            style={[
              styles.tabIndicator,
              activeTab === '보호소 소개' ? styles.tabIndicatorActive : styles.tabIndicatorInactive,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('입양 홍보')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === '입양 홍보' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            입양 홍보
          </Text>
          <View
            style={[
              styles.tabIndicator,
              activeTab === '입양 홍보' ? styles.tabIndicatorActive : styles.tabIndicatorInactive,
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* 탭 내용 */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === '보호소 소개' ? (
          <View style={styles.shelterContent}>
            {/* 하위 메뉴 1: 나와 가까운 보호소 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>나와 가까운 보호소</Text>
              <View style={styles.miniMapContainer} />
            </View>

            {/* 하위 메뉴 2: 지역구별 검색 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>지역구별 검색</Text>
              <View style={styles.searchButtonsContainer}>
                {/* 지역 버튼 */}
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowRegionModal(true)}
                >
                  <Text style={styles.dropdownButtonText}>
                    {selectedRegion || '지역'}
                  </Text>
                  <Image
                    source={require('../assets/icon_arrowDown.png')}
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>

                {/* 군/구 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    !selectedRegion && styles.dropdownButtonDisabled,
                  ]}
                  onPress={() => {
                    if (selectedRegion) {
                      setShowDistrictModal(true);
                    }
                  }}
                  disabled={!selectedRegion}
                >
                  <Text style={styles.dropdownButtonText}>
                    {selectedDistrict || '군/구'}
                  </Text>
                  <Image
                    source={require('../assets/icon_arrowDown.png')}
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>

                {/* 재검색 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.refreshButton,
                    { marginLeft: getRefreshButtonMargin() },
                  ]}
                  onPress={() => {
                    // 재검색 로직 (추후 구현)
                    console.log('재검색');
                  }}
                >
                  <Text style={styles.refreshButtonText}>재검색</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.adoptContent}>
            <View style={styles.adoptFilterContainer}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowPetTypeModal(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {selectedPetType}
                </Text>
                <Image
                  source={require('../assets/icon_arrowDown.png')}
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 지역 선택 모달 */}
      <Modal
        visible={showRegionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRegionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRegionModal(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {REGIONS.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedRegion(region);
                    setSelectedDistrict(''); // 지역 변경시 군/구 초기화
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

      {/* 군/구 선택 모달 */}
      <Modal
        visible={showDistrictModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDistrictModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDistrictModal(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedRegion &&
                DISTRICTS[selectedRegion]?.map((district) => (
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

      {/* 반려동물 타입 선택 모달 */}
      <Modal
        visible={showPetTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPetTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPetTypeModal(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {PET_TYPES.map((petType) => (
                <TouchableOpacity
                  key={petType}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedPetType(petType);
                    setShowPetTypeModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{petType}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: 250,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  tabText: {
    fontSize: 20,
    marginBottom: 12,
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#1F2024',
  },
  tabTextInactive: {
    fontWeight: '600',
    color: '#71727A',
  },
  tabIndicator: {
    width: '100%',
    height: 2,
  },
  tabIndicatorActive: {
    backgroundColor: '#0081D5',
  },
  tabIndicatorInactive: {
    backgroundColor: '#EAECEE',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  shelterContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  miniMapContainer: {
    width: 350,
    height: 180,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 4,
    alignSelf: 'center',
  },
  searchButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingLeft: 8,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#B3B6B8',
    marginRight: 12,
  },
  dropdownButtonDisabled: {
    opacity: 0.5,
  },
  dropdownButtonText: {
    color: '#7B7C7D',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
    marginRight: 4,
  },
  dropdownIcon: {
    width: 10,
    height: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    height: 34,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#0081D5',
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  adoptContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  adoptFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#71727A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
    padding: 10,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECEE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1F2024',
  },
});
