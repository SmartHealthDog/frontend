import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { RootStackParamList } from '../../App';
import CustomButton from '../components/CustomButton';

type RouteProps = RouteProp<RootStackParamList, 'WalkActive'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (seconds: number) => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
};

const formatPeriod = (time: string) => {
  const hour = parseInt(time.split(':')[0] || '0', 10);
  return hour >= 12 ? '오후' : '오전';
};

const formatDateLabel = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  return `${yyyy}. ${mm}. ${dd}`;
};

const formatClock = (date: Date) => {
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

const formatDurationMinutes = (seconds: number) => `${Math.round(seconds / 60)}분`;

export default function WalkActiveScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const { petName, petImage } = route.params;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [mapLoadError, setMapLoadError] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [initialCoord, setInitialCoord] = useState<{ lat: number; lng: number } | null>(null);

  const startDateRef = useRef<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const badgeAnim = useRef(new Animated.Value(0.6)).current;
  const watchIdRef = useRef<number | null>(null);
  const lastCoordRef = useRef<{ lat: number; lng: number } | null>(null);
  const pauseTrackingRef = useRef(false);

  const startDate = startDateRef.current;

  const startTimeText = useMemo(() => formatClock(startDate), [startDate]);
  const startPeriod = useMemo(() => formatPeriod(startTimeText), [startTimeText]);
  const endDate = useMemo(
    () => new Date(startDate.getTime() + elapsedSeconds * 1000),
    [startDate, elapsedSeconds]
  );
  const endTimeText = useMemo(() => formatClock(endDate), [endDate]);
  const endPeriod = useMemo(() => formatPeriod(endTimeText), [endTimeText]);
  const dateLabel = useMemo(() => formatDateLabel(startDate), [startDate]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgeAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(badgeAnim, {
          toValue: 0.6,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [badgeAnim]);

  // 위치 권한 요청 (포그라운드) + 위치 추적
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한',
            message: '산책 거리 측정을 위해 위치 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      // iOS는 Info.plist 설정 가정
      return true;
    };

    const startWatch = async () => {
      const ok = await requestPermission();
      if (!ok) return;

      watchIdRef.current = Geolocation.watchPosition(
        (pos: GeoPosition) => {
          const { latitude, longitude } = pos.coords;
          const current = { lat: latitude, lng: longitude };
          if (!initialCoord) {
            setInitialCoord(current);
          }
          // 일시정지 시 거리 누적 중단, 현재 좌표만 기억
          if (pauseTrackingRef.current) {
            lastCoordRef.current = current;
            return;
          }
          if (lastCoordRef.current) {
            const inc = haversine(lastCoordRef.current, current);
            setDistanceKm((prev) => prev + inc);
          }
          lastCoordRef.current = current;
        },
        () => {},
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 2000,
          fastestInterval: 1000,
          showsBackgroundLocationIndicator: false,
        }
      );
    };

    startWatch();

    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [initialCoord, isPaused]);

  const handlePauseToggle = () => {
    setIsPaused((prev) => {
      const next = !prev;
      pauseTrackingRef.current = next;
      return next;
    });
  };

  const handleStop = () => {
    setIsPaused(true);
    pauseTrackingRef.current = true;
    setShowConfirmModal(true);
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setIsPaused(false);
    pauseTrackingRef.current = false;
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowResultModal(true);
  };

  const handleResultConfirm = () => {
    navigation.goBack();
  };

  const distanceText = useMemo(() => `${distanceKm.toFixed(1)}`, [distanceKm]);
  const timerText = useMemo(() => formatTime(elapsedSeconds), [elapsedSeconds]);
  const resultDuration = useMemo(() => formatDurationMinutes(elapsedSeconds), [elapsedSeconds]);
  const kakaoHtml = useMemo(() => {
    const center = initialCoord ?? { lat: 37.5665, lng: 126.9780 }; // 서울 시청 기본값
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
          <style>
            html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #E9ECEF; }
          </style>
          <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=e65e93f752b1590bf9b8be83566dd5b6&autoload=false"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            (function() {
              kakao.maps.load(function() {
                var map = new kakao.maps.Map(document.getElementById('map'), {
                  center: new kakao.maps.LatLng(${center.lat}, ${center.lng}),
                  level: 4
                });
              });
            })();
          </script>
        </body>
      </html>
    `;
  }, [initialCoord]);

  const haversine = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const h =
      sinDLat * sinDLat +
      sinDLng * sinDLng * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
  };

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <View style={styles.container}>
      {/* 배경 카카오맵 (WebView) + 실패 시 스켈레톤 */}
      {mapLoadError ? (
        <View style={[styles.mapBackground, styles.mapFallback]} />
      ) : (
        <WebView
          key="walk-active-map"
          originWhitelist={['*']}
          source={{ html: kakaoHtml }}
          style={styles.mapBackground}
          javaScriptEnabled
          domStorageEnabled
          cacheEnabled={false}
          setSupportMultipleWindows={false}
          thirdPartyCookiesEnabled
          onLoadStart={() => {
            setMapReady(false);
            setMapLoadError(false);
          }}
          onLoadEnd={() => setMapReady(true)}
          onError={() => {
            if (!mapReady) setMapLoadError(true);
          }}
          onHttpError={() => {
            if (!mapReady) setMapLoadError(true);
          }}
          renderError={() => {
            setMapLoadError(true);
            return <View style={styles.mapFallback} />;
          }}
        />
      )}

      {/* 상단 배지 */}
      <Animated.View style={[styles.statusBadge, { opacity: badgeAnim }]}>
        <Text style={styles.statusBadgeText}>{`${petName}(이)랑 산책 중입니다`}</Text>
      </Animated.View>

      {/* 바텀시트 */}
      <View style={styles.bottomSheet}>
        {/* 측정 영역 */}
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{distanceText}</Text>
            <Text style={styles.metricLabel}>거리(km)</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricBox}>
            <Text style={[styles.metricValue, isPaused && styles.metricValuePaused]}>{timerText}</Text>
            <Text style={styles.metricLabel}>시간(분)</Text>
          </View>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity activeOpacity={0.85} onPress={handlePauseToggle}>
            <Image source={require('../assets/btn_pause.png')} style={styles.controlButton} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={handleStop}>
            <Image source={require('../assets/btn_stop.png')} style={styles.controlButton} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 종료 확인 모달 */}
      <Modal visible={showConfirmModal} transparent animationType="fade" onRequestClose={handleConfirmNo}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>
              산책을<Text style={styles.confirmTextHighlight}> 종료</Text>하시겠습니까?
            </Text>
            <View style={styles.confirmButtons}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleConfirmNo}
              style={styles.confirmNoButton}
            >
              <Text style={styles.confirmNoText}>아니오</Text>
            </TouchableOpacity>
              <CustomButton text="예" onPress={handleConfirmYes} width={110} />
            </View>
          </View>
        </View>
      </Modal>

      {/* 결과 모달 */}
      <Modal visible={showResultModal} transparent animationType="fade" onRequestClose={handleResultConfirm}>
        <View style={styles.modalOverlay}>
          <View style={styles.resultModal}>
            <Text style={styles.resultTitle}>오늘의 산책 기록</Text>

            {/* 함께한 반려동물 */}
            <View style={styles.resultSection}>
              <Text style={styles.resultSubtitle}>함께한 반려동물</Text>
              <View style={styles.resultAvatarWrapper}>
                <Image source={petImage} style={styles.resultAvatar} />
              </View>
            </View>

            {/* 산책 기록 */}
            <View style={[styles.resultSection, styles.resultSectionSpacing]}>
              <Text style={styles.resultSubtitle}>산책 기록</Text>
              <View style={styles.resultTexts}>
                <Text style={styles.resultInfoText}>
                  {dateLabel} {startPeriod} {startTimeText} ~ {endPeriod} {endTimeText}
                </Text>
                <Text style={styles.resultInfoText}>
                  {distanceText}km, {resultDuration}
                </Text>
              </View>
            </View>

            <View style={styles.resultButtonContainer}>
              <CustomButton text="확인" onPress={handleResultConfirm} width={230} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#DCE2EA',
  },
  mapFallback: {
    backgroundColor: '#E9ECEF',
  },
  statusBadge: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    width: 160,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#7B7C7D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    color: '#3C4144',
    fontSize: 32,
    fontWeight: '500',
  },
  metricValuePaused: {
    color: '#EF5F5F',
  },
  metricLabel: {
    marginTop: 8,
    color: '#7B7C7D',
    fontSize: 14,
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    height: 56,
    backgroundColor: '#EAECEE',
    marginHorizontal: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 24,
  },
  controlButton: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    shadowColor: 'rgba(132, 132, 132, 0.25)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  confirmModal: {
    width: 290,
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  confirmText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  confirmTextHighlight: {
    color: '#EF5F5F',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  confirmNoButton: {
    width: 110,
    height: 55,
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#E1E1E1', // CustomButton disabled color
  },
  confirmNoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7B7C7D',
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 22,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  resultModal: {
    width: 290,
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  resultTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultSection: {
    marginTop: 16,
    marginLeft: 0,
  },
  resultSectionSpacing: {
    marginTop: 8,
  },
  resultSubtitle: {
    color: '#3C4144',
    textAlign: 'left',
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: '700',
  },
  resultAvatarWrapper: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  resultAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  resultTexts: {
    marginTop: 4,
  },
  resultInfoText: {
    color: '#7B7C7D',
    textAlign: 'left',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  resultButtonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});

