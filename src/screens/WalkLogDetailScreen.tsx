import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type WalkLogDetailRouteProp = RouteProp<RootStackParamList, 'WalkLogDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatDateLabel = (dateText: string) => {
  // "2025.11.16" -> "2025. 11. 16"
  return dateText.replace(/\./g, '. ').trim();
};

const parseDuration = (duration: string) => {
  const cleaned = duration.replace(/\s/g, '');
  const [h = '0', m = '0', s = '0'] = cleaned.split(':');
  const hours = parseInt(h, 10) || 0;
  const minutes = parseInt(m, 10) || 0;
  const seconds = parseInt(s, 10) || 0;
  return { hours, minutes, seconds };
};

const addDurationToTime = (startTime: string, duration: string) => {
  // startTime: "HH:MM"
  const [sh = '0', sm = '0'] = startTime.split(':');
  const startMinutes = (parseInt(sh, 10) || 0) * 60 + (parseInt(sm, 10) || 0);
  const { hours, minutes, seconds } = parseDuration(duration);
  const durationMinutesTotal = hours * 60 + minutes + seconds / 60;
  const totalMinutes = startMinutes + durationMinutesTotal;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = Math.round(totalMinutes % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(endHours)}:${pad(endMinutes)}`;
};

const getPeriodLabel = (time: string) => {
  const hour = parseInt(time.split(':')[0] || '0', 10);
  return hour >= 12 ? '오후' : '오전';
};

const formatTime = (time: string) => {
  const [h = '0', m = '0'] = time.split(':');
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(parseInt(h, 10) || 0)}:${pad(parseInt(m, 10) || 0)}`;
};

const formatDurationMinutes = (duration: string) => {
  const { hours, minutes, seconds } = parseDuration(duration);
  const totalMinutes = hours * 60 + minutes + seconds / 60;
  const rounded = Math.round(totalMinutes);
  return `${rounded}분`;
};

export default function WalkLogDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WalkLogDetailRouteProp>();
  const { record } = route.params;
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const startTime = record.startTime ?? '00:00';

  const endTime = useMemo(() => addDurationToTime(startTime, record.duration), [record, startTime]);
  const startPeriod = useMemo(() => getPeriodLabel(startTime), [startTime]);
  const endPeriod = useMemo(() => getPeriodLabel(endTime), [endTime]);

  const headerTitle = `${record.date} 산책 일지`;
  const formattedDate = formatDateLabel(record.date);
  const startTimeFormatted = formatTime(startTime);
  const endTimeFormatted = formatTime(endTime);
  const durationText = formatDurationMinutes(record.duration);
  const distanceText = record.distance;

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

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icon_navBack.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 지도 스켈레톤 */}
        <Animated.View style={[styles.mapSkeleton, { opacity: pulseAnim }]} />

        {/* 함께한 반려견 */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>함께한 반려동물</Text>
          <View style={styles.petAvatarWrapper}>
            <Image source={record.petImage} style={styles.petAvatar} />
          </View>
        </View>

        {/* 산책 기록 */}
        <View style={[styles.section, styles.sectionSpacing]}>
          <Text style={styles.subtitle}>산책 기록</Text>
          <View style={styles.walkTexts}>
            <Text style={styles.walkInfoText}>
              {formattedDate} {startPeriod} {startTimeFormatted} ~ {endPeriod} {endTimeFormatted}
            </Text>
            <Text style={styles.walkInfoText}>
              {distanceText}, {durationText}
            </Text>
          </View>
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
    paddingBottom: 40,
  },
  mapSkeleton: {
    width: '100%',
    height: 450,
    backgroundColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapSkeletonText: {
    color: '#7B7C7D',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginTop: 16,
    marginLeft: 20,
  },
  sectionSpacing: {
    marginTop: 8,
  },
  subtitle: {
    color: '#3C4144',
    textAlign: 'left',
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: '700',
  },
  petAvatarWrapper: {
    marginTop: 8,
  },
  petAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  walkTexts: {
    marginTop: 4,
  },
  walkInfoText: {
    color: '#7B7C7D',
    textAlign: 'left',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});

