import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");
const BANNER_ASPECT = 1010 / 569;

const banners = [
  { id: "1", image: require("../assets/img_banner.png") },
  { id: "2", image: require("../assets/img_banner.png") },
  { id: "3", image: require("../assets/img_banner.png") },
];
const bannerData = [...banners, { ...banners[0], id: "loop-0" }]; // 마지막에 첫 배너 복제 (고유 id로 키 충돌 방지)

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const AUTO_INTERVAL = 3500;
  const currentRawIndexRef = useRef(0); // 실질 스크롤 위치 (복제 포함)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    currentRawIndexRef.current = index;

    // 복제 배너(마지막)까지 갔다면 애니메이션 없이 0번으로 점프
    if (index === banners.length) {
      flatListRef.current?.scrollToIndex({ index: 0, animated: false });
      setCurrentIndex(0);
      currentRawIndexRef.current = 0;
    } else {
      setCurrentIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const rawNext = currentRawIndexRef.current + 1;
      // 복제 포함 길이 사용
      const targetIndex = rawNext > bannerData.length - 1 ? 1 : rawNext;
      scrollTo(targetIndex);
    }, AUTO_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={bannerData}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.bannerBox}>
            <Image source={item.image} style={styles.bannerImage} />

            {/* 🔹 배너 내부 아래 중앙에 위치하는 Dot */}
            <View style={styles.dotContainer}>
              {banners.map((_, idx) => (
                <View
                  key={idx}
                  style={[styles.dot, currentIndex === idx && styles.activeDot]}
                />
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    marginTop: 20,
  },

  bannerBox: {
    width: width,
    aspectRatio: BANNER_ASPECT, // 원본 비율 유지
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  /** 🔹 Dot을 배너 영역 안쪽에 배치 */
  dotContainer: {
    position: "absolute",
    bottom: 16,     // 배너 내부 아래 여백
    flexDirection: "row",
    alignSelf: "center",
    gap: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#C4C4C4",
  },

  activeDot: {
    backgroundColor: "#2A7BE4",
    width: 8,
    height: 8,
  },
});
