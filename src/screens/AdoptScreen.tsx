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
import DropdownButton from '../components/DropdownButton';
import CustomButton from '../components/CustomButton';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabType = '보호소 소개' | '입양 홍보';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const INITIAL_BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT - 210;
const MAX_BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT - 100;
const KAKAO_APP_KEY = 'e65e93f752b1590bf9b8be83566dd5b6';

interface ShelterInfo {
  name: string;
  rating: number;
  address: string;
  phone: string;
  image: any;
  region: string;
  district: string;
  openStatus: string;
  openHours: string;
}

interface AnimalInfo {
  id: string;
  name: string;
  type: '강아지' | '고양이';
  tags: string[];
  breed: string;
  age: string;
  location: string;
  image: any;
}

// 지역/군구 더미데이터 (HealthScreen과 동일하게 유지)
const REGIONS = [
  '서울특별시',
  '경기도',
  '인천광역시',
  '부산광역시',
  '대구광역시',
];

const DISTRICTS: { [key: string]: string[] } = {
  '서울특별시': ['양천구', '강남구', '서초구', '구로구', '마포구'],
  '경기도': ['성남시', '용인시', '수원시'],
  '인천광역시': ['미추홀구', '연수구', '부평구'],
  '부산광역시': ['해운대구', '부산진구'],
  '대구광역시': ['수성구', '달서구'],
};

// 반려동물 타입 데이터
const PET_TYPES = ['모두', '강아지', '고양이'];

const ANIMALS: AnimalInfo[] = [
  {
    id: 'd1',
    name: '보리',
    type: '강아지',
    tags: ['공고중', '수컷', '활발'],
    breed: '[개] 믹스견',
    age: '8개월(추정)',
    location: '양천구',
    image: require('../assets/img_adoptDog.png'),
  },
  {
    id: 'd2',
    name: '몽실',
    type: '강아지',
    tags: ['공고중', '암컷', '순둥'],
    breed: '[개] 푸들 믹스',
    age: '2살(추정)',
    location: '강남구',
    image: require('../assets/img_adoptDog.png'),
  },
  {
    id: 'd3',
    name: '초코',
    type: '강아지',
    tags: ['공고중', '수컷'],
    breed: '[개] 닥스훈트',
    age: '1살(추정)',
    location: '수성구',
    image: require('../assets/img_adoptDog.png'),
  },
  {
    id: 'd4',
    name: '콩이',
    type: '강아지',
    tags: ['공고중', '암컷', '소형'],
    breed: '[개] 포메라니안',
    age: '5살(추정)',
    location: '해운대구',
    image: require('../assets/img_adoptDog.png'),
  },
  {
    id: 'd5',
    name: '바다',
    type: '강아지',
    tags: ['공고중', '수컷', '중형'],
    breed: '[개] 진돗개 믹스',
    age: '3살(추정)',
    location: '부평구',
    image: require('../assets/img_adoptDog.png'),
  },
  {
    id: 'c1',
    name: '하늘',
    type: '고양이',
    tags: ['공고중', '수컷', '온순'],
    breed: '[묘] 코리안숏헤어',
    age: '6개월(추정)',
    location: '마포구',
    image: require('../assets/img_adoptCat.png'),
  },
  {
    id: 'c2',
    name: '라떼',
    type: '고양이',
    tags: ['공고중', '암컷', '활발'],
    breed: '[묘] 샴 믹스',
    age: '1살(추정)',
    location: '용인시',
    image: require('../assets/img_adoptCat.png'),
  },
  {
    id: 'c3',
    name: '두리',
    type: '고양이',
    tags: ['공고중', '수컷'],
    breed: '[묘] 러시안블루',
    age: '2살(추정)',
    location: '연수구',
    image: require('../assets/img_adoptCat.png'),
  },
  {
    id: 'c4',
    name: '밀크',
    type: '고양이',
    tags: ['공고중', '암컷', '순둥'],
    breed: '[묘] 페르시안',
    age: '4살(추정)',
    location: '성남시',
    image: require('../assets/img_adoptCat.png'),
  },
  {
    id: 'c5',
    name: '밤비',
    type: '고양이',
    tags: ['공고중', '수컷', '호기심많음'],
    breed: '[묘] 아비시니안',
    age: '9개월(추정)',
    location: '달서구',
    image: require('../assets/img_adoptCat.png'),
  },
];

const SHELTERS: ShelterInfo[] = [
  {
    name: '행복보호소',
    rating: 4.6,
    address: '서울특별시 양천구 목동로 120',
    phone: '02-2010-0001',
    image: require('../assets/adopt_placeholder.png'),
    region: '서울특별시',
    district: '양천구',
    openStatus: '영업중',
    openHours: '(월-금) 10:00 - 19:00',
  },
  {
    name: '해피독 센터',
    rating: 4.8,
    address: '서울특별시 강남구 테헤란로 420',
    phone: '02-550-8888',
    image: require('../assets/adopt_placeholder.png'),
    region: '서울특별시',
    district: '강남구',
    openStatus: '영업중',
    openHours: '(매일) 09:00 - 21:00',
  },
  {
    name: '서초 동물케어',
    rating: 4.5,
    address: '서울특별시 서초구 반포대로 310',
    phone: '02-345-7755',
    image: require('../assets/adopt_placeholder.png'),
    region: '서울특별시',
    district: '서초구',
    openStatus: '영업중',
    openHours: '(화-일) 10:00 - 20:00',
  },
  {
    name: '구로 희망쉼터',
    rating: 4.2,
    address: '서울특별시 구로구 디지털로 200',
    phone: '02-860-2222',
    image: require('../assets/adopt_placeholder.png'),
    region: '서울특별시',
    district: '구로구',
    openStatus: '영업중',
    openHours: '(월-토) 09:30 - 18:30',
  },
  {
    name: '마포 러브펫',
    rating: 4.7,
    address: '서울특별시 마포구 월드컵북로 44',
    phone: '02-313-0909',
    image: require('../assets/adopt_placeholder.png'),
    region: '서울특별시',
    district: '마포구',
    openStatus: '영업중',
    openHours: '(매일) 10:00 - 22:00',
  },
  {
    name: '성남 해피테일',
    rating: 4.4,
    address: '경기도 성남시 분당구 불정로 50',
    phone: '031-720-3333',
    image: require('../assets/adopt_placeholder.png'),
    region: '경기도',
    district: '성남시',
    openStatus: '영업중',
    openHours: '(월-금) 09:30 - 19:00',
  },
  {
    name: '용인 퍼피랜드',
    rating: 4.3,
    address: '경기도 용인시 수지구 푸른로 88',
    phone: '031-520-1122',
    image: require('../assets/adopt_placeholder.png'),
    region: '경기도',
    district: '용인시',
    openStatus: '영업중',
    openHours: '(화-일) 10:00 - 20:00',
  },
  {
    name: '수원 케어하우스',
    rating: 4.6,
    address: '경기도 수원시 영통구 대학로 100',
    phone: '031-204-7000',
    image: require('../assets/adopt_placeholder.png'),
    region: '경기도',
    district: '수원시',
    openStatus: '영업중',
    openHours: '(매일) 09:00 - 21:00',
  },
  {
    name: '인천 미추홀 케어',
    rating: 4.1,
    address: '인천광역시 미추홀구 독배로 15',
    phone: '032-880-6600',
    image: require('../assets/adopt_placeholder.png'),
    region: '인천광역시',
    district: '미추홀구',
    openStatus: '영업중',
    openHours: '(월-토) 10:00 - 19:00',
  },
  {
    name: '연수 반려촌',
    rating: 4.5,
    address: '인천광역시 연수구 센트럴로 120',
    phone: '032-830-0404',
    image: require('../assets/adopt_placeholder.png'),
    region: '인천광역시',
    district: '연수구',
    openStatus: '영업중',
    openHours: '(매일) 09:30 - 20:30',
  },
  {
    name: '부평 하트펫',
    rating: 4.0,
    address: '인천광역시 부평구 길주로 200',
    phone: '032-520-7777',
    image: require('../assets/adopt_placeholder.png'),
    region: '인천광역시',
    district: '부평구',
    openStatus: '영업중',
    openHours: '(화-일) 10:00 - 21:00',
  },
  {
    name: '해운대 러브펫',
    rating: 4.6,
    address: '부산광역시 해운대구 센텀서로 45',
    phone: '051-740-2020',
    image: require('../assets/adopt_placeholder.png'),
    region: '부산광역시',
    district: '해운대구',
    openStatus: '영업중',
    openHours: '(매일) 09:00 - 20:00',
  },
  {
    name: '부산진 해피포즈',
    rating: 4.3,
    address: '부산광역시 부산진구 가야대로 610',
    phone: '051-320-5555',
    image: require('../assets/adopt_placeholder.png'),
    region: '부산광역시',
    district: '부산진구',
    openStatus: '영업중',
    openHours: '(월-토) 09:30 - 18:30',
  },
  {
    name: '수성 해피테일',
    rating: 4.4,
    address: '대구광역시 수성구 동대구로 320',
    phone: '053-770-3030',
    image: require('../assets/adopt_placeholder.png'),
    region: '대구광역시',
    district: '수성구',
    openStatus: '영업중',
    openHours: '(매일) 10:00 - 21:00',
  },
  {
    name: '달서 퍼피케어',
    rating: 4.2,
    address: '대구광역시 달서구 월배로 180',
    phone: '053-620-0909',
    image: require('../assets/adopt_placeholder.png'),
    region: '대구광역시',
    district: '달서구',
    openStatus: '영업중',
    openHours: '(화-일) 10:30 - 20:30',
  },
];

export default function AdoptScreen() {
  const navigation = useNavigation<NavigationProp>();
  const contentScrollRef = useRef<ScrollView>(null);
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
  const [mapReady, setMapReady] = useState(false);
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

  const filteredShelters = useMemo(() => {
    return SHELTERS.filter((shelter) => {
      if (selectedRegion && shelter.region !== selectedRegion) return false;
      if (selectedDistrict && shelter.district !== selectedDistrict) return false;
      return true;
    });
  }, [selectedDistrict, selectedRegion]);

  const handleResetFilters = useCallback(() => {
    setSelectedRegion('');
    setSelectedDistrict('');
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    contentScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const filteredAnimals = useMemo(() => {
    const list =
      selectedPetType === '모두'
        ? ANIMALS
        : ANIMALS.filter((animal) => animal.type === selectedPetType);
    return [...list].sort(() => Math.random() - 0.5);
  }, [selectedPetType]);

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
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #E9ECEF; }
            #map { width: 100%; height: 100%; }
          </style>
          <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            (function() {
              kakao.maps.load(function() {
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
          onPress={() => handleTabChange('보호소 소개')}
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
          onPress={() => handleTabChange('입양 홍보')}
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
      <ScrollView
        style={styles.contentContainer}
        ref={contentScrollRef}
      >
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
                    cacheEnabled={false}
                    setSupportMultipleWindows={false}
                    thirdPartyCookiesEnabled
                    onLoadStart={() => {
                      setMapReady(false);
                      setMapLoaded(false);
                    }}
                    onLoadEnd={() => {
                      setMapReady(true);
                      setMapLoaded(true);
                    }}
                    onError={() => {
                      if (!mapReady) setMapLoaded(false);
                    }}
                    onHttpError={() => {
                      if (!mapReady) setMapLoaded(false);
                    }}
                    renderError={() => {
                      setMapLoaded(false);
                      return <View style={styles.miniMapFallback} />;
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
                <View style={styles.dropdownGroup}>
                  {/* 지역 버튼 */}
                  <DropdownButton
                    label={selectedRegion || '지역'}
                    onPress={() => setShowRegionModal(true)}
                    style={{ marginRight: 12 }}
                  />

                  {/* 군/구 버튼 */}
                  <DropdownButton
                    label={selectedDistrict || '군/구'}
                    onPress={() => {
                      if (selectedRegion) {
                        setShowDistrictModal(true);
                      }
                    }}
                    disabled={!selectedRegion}
                    style={{ marginRight: 12 }}
                  />
                </View>

                {/* 재검색 버튼 */}
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={handleResetFilters}
                >
                  <Text style={styles.refreshButtonText}>초기화</Text>
                </TouchableOpacity>
              </View>

              {/* 보호소 카드 리스트 */}
              <View style={styles.shelterListContainer}>
                {filteredShelters.length === 0 ? (
                  <Text style={styles.emptyText}>선택한 조건에 맞는 보호소가 없어요.</Text>
                ) : (
                  filteredShelters.map((shelter) => (
                    <TouchableOpacity 
                      key={shelter.name} 
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
                  ))
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.adoptContent}>
            <View style={styles.adoptFilterContainer}>
              <DropdownButton
                label={selectedPetType}
                onPress={() => setShowPetTypeModal(true)}
              />
            </View>

            {/* 동물 카드 리스트 */}
            <View style={styles.animalListContainer}>
                {filteredAnimals.map((animal) => (
                  <TouchableOpacity
                    key={animal.id}
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
                ))}
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
                    <Text style={styles.infoTextHighlight}>{selectedShelter.openStatus}</Text>
                    <Text style={styles.infoText}>{selectedShelter.openHours}</Text>
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
  miniMapFallback: {
    flex: 1,
    backgroundColor: '#E9ECEF',
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
    justifyContent: 'space-between',
    width: '100%',
  },
  dropdownGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
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
  emptyText: {
    color: '#7B7C7D',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    lineHeight: 16,
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
