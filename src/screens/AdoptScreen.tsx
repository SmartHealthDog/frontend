import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Modal, 
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  Alert,
  Clipboard,
  PermissionsAndroid,
  Platform,
  Easing,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabType = '보호소 소개' | '입양 홍보';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const INITIAL_BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT - 200;
const MAX_BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT - 100;
const KAKAO_APP_KEY = 'e65e93f752b1590bf9b8be83566dd5b6';

interface ShelterInfo {
  name: string;
  rating: number;
  address: string;
  phone: string;
  image: any;
}

interface AnimalInfo {
  type: '강아지' | '고양이';
  tags: string[];
  breed: string;
  age: string;
  location: string;
  image: any;
}

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
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('보호소 소개');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState<string>('모두');
  const [showPetTypeModal, setShowPetTypeModal] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<ShelterInfo | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.9780,
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  
  const bottomSheetHeight = useRef(new Animated.Value(INITIAL_BOTTOM_SHEET_HEIGHT)).current;
  const bottomSheetY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // 화면이 포커스될 때마다 선택 내용 초기화
  useFocusEffect(
    useCallback(() => {
      setSelectedRegion('');
      setSelectedDistrict('');
      setSelectedPetType('모두');
    }, [])
  );

  // 안드로이드 위치 권한 요청 + 현재 위치 가져오기
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS !== 'android') return;
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '현재 위치를 표시하려면 위치 권한이 필요합니다.',
            buttonPositive: '확인',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position: { coords: { latitude: number; longitude: number } }) => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error: unknown) => {
              console.log('위치 조회 실패', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 30000,
              forceRequestLocation: true,
            }
          );
        }
      } catch (error) {
        console.log('위치 권한 요청 실패', error);
      }
    };

    requestLocationPermission();
  }, []);

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

  // 바텀시트 열기
  const openBottomSheet = (shelter: ShelterInfo) => {
    setSelectedShelter(shelter);
    setShowBottomSheet(true);
    bottomSheetY.setValue(SCREEN_HEIGHT);
    Animated.spring(bottomSheetY, {
      toValue: SCREEN_HEIGHT - INITIAL_BOTTOM_SHEET_HEIGHT,
      useNativeDriver: false,
      tension: 50,
    }).start();
  };

  // 바텀시트 닫기
  const closeBottomSheet = () => {
    Animated.timing(bottomSheetY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowBottomSheet(false);
      setSelectedShelter(null);
    });
  };

  // 바텀시트 드래그 핸들러
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = SCREEN_HEIGHT - INITIAL_BOTTOM_SHEET_HEIGHT + gestureState.dy;
        const minY = SCREEN_HEIGHT - MAX_BOTTOM_SHEET_HEIGHT;
        const maxY = SCREEN_HEIGHT - INITIAL_BOTTOM_SHEET_HEIGHT;
        
        if (newY >= minY && newY <= maxY) {
          bottomSheetY.setValue(newY);
        } else if (newY > maxY) {
          bottomSheetY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentY = SCREEN_HEIGHT - INITIAL_BOTTOM_SHEET_HEIGHT + gestureState.dy;
        
        // 아래로 드래그 - 닫기
        if (gestureState.dy > 100) {
          closeBottomSheet();
        }
        // 위로 드래그 - 전체 화면
        else if (gestureState.dy < -50) {
          Animated.spring(bottomSheetY, {
            toValue: SCREEN_HEIGHT - MAX_BOTTOM_SHEET_HEIGHT,
            useNativeDriver: false,
            tension: 50,
          }).start();
        }
        // 원래 위치로
        else {
          Animated.spring(bottomSheetY, {
            toValue: SCREEN_HEIGHT - INITIAL_BOTTOM_SHEET_HEIGHT,
            useNativeDriver: false,
            tension: 50,
          }).start();
        }
      },
    })
  ).current;

  // 전화번호 복사
  const copyPhoneNumber = () => {
    if (selectedShelter?.phone) {
      Clipboard.setString(selectedShelter.phone);
      Alert.alert('보호소 전화번호가 복사되었습니다.');
    }
  };

  const handleMapMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Map WebView message:', event.nativeEvent.data);
      if (data.type === 'loaded') {
        setMapLoaded(true);
        setMapError(null);
      } else if (data.type === 'error') {
        setMapLoaded(false);
        setMapError(data.message || 'map error');
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    setMapLoaded(false);
    setMapError(null);
  }, [currentLocation.lat, currentLocation.lng]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const mapHtml = useMemo(
    () => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
          <style>
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
            #map { width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            (function() {
              const post = (payload) => {
                try {
                  window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload));
                } catch (e) {
                  // ignore
                }
              };

              window.onerror = function(message, source, lineno, colno, error) {
                post({ type: 'error', message, source, lineno, colno, stack: error && error.stack });
              };

              // 동적으로 스크립트 로드하여 로드 실패 사유를 잡아낸다.
              const tryLoad = (useHttps) => {
                const protocol = useHttps ? 'https:' : 'http:';
                const src = protocol + '//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false';
                const script = document.createElement('script');
                script.src = src;
                script.onload = function() {
                  try {
                    if (!(window.kakao && window.kakao.maps)) {
                      post({ type: 'error', message: 'kakao maps not available after load', src });
                      return;
                    }
                    kakao.maps.load(function() {
                      post({ type: 'loaded', src });
                      var center = new kakao.maps.LatLng(${currentLocation.lat}, ${currentLocation.lng});
                      var map = new kakao.maps.Map(document.getElementById('map'), {
                        center: center,
                        level: 3
                      });
                      new kakao.maps.Marker({
                        position: center,
                        map: map
                      });
                    });
                  } catch (err) {
                    post({ type: 'error', message: 'load exec error', stack: err && err.stack, src });
                  }
                };
                script.onerror = function(e) {
                  post({ type: 'error', message: 'kakao maps script load failed', detail: e && e.message, src });
                  if (useHttps) {
                    // fall back to http once
                    tryLoad(false);
                  }
                };
                document.head.appendChild(script);
              };

              // 사전 연결 테스트
              fetch('https://dapi.kakao.com/v2/maps/sdk.js', { method: 'HEAD' })
                .then((res) => {
                  post({ type: 'prefetch', status: res.status });
                  tryLoad(true);
                })
                .catch((err) => {
                  post({ type: 'prefetch-error', message: err && err.message });
                  tryLoad(true);
                });
            })();
          </script>
        </body>
      </html>
    `,
    [currentLocation.lat, currentLocation.lng]
  );

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
              <View style={styles.miniMapContainer}>
                <View style={styles.miniMapWrapper}>
                  <WebView
                    ref={webViewRef}
                    originWhitelist={['*']}
                    source={{ html: mapHtml, baseUrl: 'http://localhost' }}
                    style={styles.miniMap}
                    javaScriptEnabled
                    domStorageEnabled
                    scrollEnabled={false}
                    mixedContentMode="always"
                    allowFileAccess
                    allowUniversalAccessFromFileURLs
                    onMessage={handleMapMessage}
                    onError={(e) => {
                      console.log('WebView load error', e.nativeEvent);
                      setMapLoaded(false);
                    }}
                    onHttpError={(e) => {
                      console.log('WebView HTTP error', e.nativeEvent);
                      setMapLoaded(false);
                    }}
                    onLoadEnd={() => {
                      // if map never loaded via message, keep skeleton
                    }}
                  />
                  {!mapLoaded && (
                    <Animated.View
                      pointerEvents="none"
                      style={[styles.mapSkeleton, { opacity: pulseAnim }]}
                    />
                  )}
                </View>
              </View>
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

              {/* 보호소 카드 리스트 */}
              <View style={styles.shelterListContainer}>
                {[1, 2, 3, 4, 5].map((item) => {
                  const shelter: ShelterInfo = {
                    name: 'ABC 동물병원',
                    rating: 4.5,
                    address: '서울시 양천구 신목로 100 2층',
                    phone: '02-1234-5678',
                    image: require('../assets/adopt_placeholder.png'),
                  };
                  
                  return (
                    <TouchableOpacity 
                      key={item} 
                      style={styles.shelterCard}
                      onPress={() => openBottomSheet(shelter)}
                      activeOpacity={0.7}
                    >
                      {/* 기관 사진 */}
                      <Image
                        source={shelter.image}
                        style={styles.shelterImage}
                      />

                      {/* 기관 정보 */}
                      <View style={styles.shelterInfo}>
                        {/* 이름 */}
                        <Text style={styles.shelterName}>{shelter.name}</Text>

                        {/* 별점 */}
                        <View style={styles.ratingContainer}>
                          <Image
                            source={require('../assets/icon_rating.png')}
                            style={styles.ratingIcon}
                          />
                          <Text style={styles.ratingText}>{shelter.rating.toFixed(1)}</Text>
                        </View>

                        {/* 주소 */}
                        <Text style={styles.shelterAddress}>{shelter.address}</Text>

                        {/* 전화번호 */}
                        <View style={styles.phoneContainer}>
                          <Image
                            source={require('../assets/icon_phoneNum.png')}
                            style={styles.phoneIcon}
                          />
                          <Text style={styles.phoneText}>{shelter.phone}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
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

            {/* 동물 카드 리스트 */}
            <View style={styles.animalListContainer}>
              {(() => {
                // 더미 데이터 생성
                const dogs: AnimalInfo[] = [1, 2, 3, 4, 5].map((item) => ({
                  type: '강아지' as const,
                  tags: ['공고중', '수컷'],
                  breed: '[개] 믹스견',
                  age: '3개월(추정)',
                  location: '양천구',
                  image: require('../assets/img_adoptDog.png'),
                }));

                const cats: AnimalInfo[] = [1, 2, 3, 4, 5].map((item) => ({
                  type: '고양이' as const,
                  tags: ['공고중', '수컷'],
                  breed: '[묘] 코리안숏헤어',
                  age: '3개월(추정)',
                  location: '양천구',
                  image: require('../assets/img_adoptCat.png'),
                }));

                // 전체 동물 리스트
                const allAnimals = [...dogs, ...cats];

                // 선택된 타입에 따라 필터링
                const filteredAnimals = 
                  selectedPetType === '모두' 
                    ? allAnimals
                    : allAnimals.filter(animal => animal.type === selectedPetType);

                return filteredAnimals.map((animal, index) => (
                  <TouchableOpacity
                    key={`${animal.type}-${index}`}
                    style={styles.animalCard}
                    onPress={() => navigation.navigate('AnimalDetail', { animalData: animal })}
                    activeOpacity={0.7}
                  >
                    {/* 동물 사진 */}
                    <Image
                      source={animal.image}
                      style={styles.animalImage}
                    />

                    {/* 동물 정보 */}
                    <View style={styles.animalInfo}>
                      {/* 동물 태그 */}
                      <View style={styles.tagsContainer}>
                        {animal.tags.map((tag, tagIndex) => (
                          <View key={tagIndex} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>

                      {/* 품종, 나이, 구조장소 */}
                      <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>품종</Text>
                          <Text style={styles.detailValue}>{animal.breed}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>나이</Text>
                          <Text style={styles.detailValue}>{animal.age}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>구조장소</Text>
                          <Text style={styles.detailValue}>{animal.location}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ));
              })()}
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

      {/* 보호소 정보 바텀시트 */}
      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="none"
        onRequestClose={closeBottomSheet}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetBackground}
            activeOpacity={1}
            onPress={closeBottomSheet}
          />
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              {
                transform: [{ translateY: bottomSheetY }],
              },
            ]}
          >
            {/* 드래그 핸들 영역 */}
            <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
              <View style={styles.dragHandle} />
            </View>

            <ScrollView 
              style={styles.bottomSheetContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedShelter && (
                <>
                  {/* 보호소 이미지 */}
                  <View style={styles.bottomSheetImageContainer}>
                    <Image
                      source={selectedShelter.image}
                      style={styles.bottomSheetImage}
                    />
                  </View>

                  {/* 기관 이름 */}
                  <Text style={styles.bottomSheetName}>{selectedShelter.name}</Text>

                  {/* 별점 */}
                  <View style={styles.bottomSheetRating}>
                    <Image
                      source={require('../assets/icon_rating.png')}
                      style={styles.ratingIcon}
                    />
                    <Text style={styles.ratingText}>{selectedShelter.rating.toFixed(1)}</Text>
                  </View>

                  {/* 구분선 */}
                  <View style={styles.divider} />

                  {/* 영업시간 */}
                  <View style={styles.infoRow}>
                    <Image
                      source={require('../assets/icon_openTime.png')}
                      style={styles.infoIcon}
                    />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoTextHighlight}>영업중</Text>
                      <Text style={styles.infoText}>(화) 11:00 - 22:00</Text>
                    </View>
                  </View>

                  {/* 주소 */}
                  <View style={styles.infoRow}>
                    <Image
                      source={require('../assets/icon_addressInfo.png')}
                      style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>{selectedShelter.address}</Text>
                  </View>

                  {/* 전화번호 */}
                  <View style={styles.infoRow}>
                    <Image
                      source={require('../assets/icon_phoneNum.png')}
                      style={styles.infoIcon}
                    />
                    <Text style={styles.infoText}>{selectedShelter.phone}</Text>
                  </View>

                  {/* 전화하기 버튼 */}
                  <View style={styles.bottomSheetButtonContainer}>
                    <CustomButton
                      text="전화하기"
                      onPress={copyPhoneNumber}
                      disabled={!selectedShelter.phone}
                      width={350}
                    />
                  </View>
                </>
              )}
            </ScrollView>
          </Animated.View>
        </View>
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
    overflow: 'hidden',
  },
  miniMapWrapper: {
    flex: 1,
    position: 'relative',
  },
  miniMap: {
    flex: 1,
  },
  mapSkeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E9ECEF',
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
  shelterListContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 120,
  },
  shelterCard: {
    width: 350,
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  shelterImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  shelterInfo: {
    marginLeft: 18,
    flex: 1,
    justifyContent: 'space-between',
  },
  shelterName: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingIcon: {
    width: 16,
    height: 16,
  },
  ratingText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 5,
  },
  shelterAddress: {
    color: '#7B7C7D',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#EEF7FD',
    alignSelf: 'flex-start',
  },
  phoneIcon: {
    width: 14,
    height: 14,
  },
  phoneText: {
    color: '#7B7C7D',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: INITIAL_BOTTOM_SHEET_HEIGHT,
    maxHeight: MAX_BOTTOM_SHEET_HEIGHT,
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
  bottomSheetContent: {
    paddingHorizontal: 20,
  },
  bottomSheetImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetImage: {
    width: 350,
    height: 200,
    borderRadius: 12,
  },
  bottomSheetName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  bottomSheetRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    width: 350,
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  infoTextHighlight: {
    color: '#0081D5',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  bottomSheetButtonContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  animalListContainer: {
    alignItems: 'center',
    paddingBottom: 120,
  },
  animalCard: {
    width: 350,
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  animalImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  animalInfo: {
    marginLeft: 18,
    flex: 1,
    justifyContent: 'space-between',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E7F1FF',
    backgroundColor: '#F2FBFA',
    marginRight: 4,
  },
  tagText: {
    color: '#0081D5',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    width: 50,
    color: '#7B7C7D',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
  },
  detailValue: {
    marginLeft: 16,
    color: '#7B7C7D',
    fontSize: 12,
    fontWeight: '500',
  },
});
