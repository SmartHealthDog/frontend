import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const { width } = Dimensions.get("window");

const banners = [
  { id: "1", text: "공지사항, 홍보 배너 등 로테이션" },
  { id: "2", text: "AI 기반 생활 케어 서비스" },
  { id: "3", text: "반려동물 건강 관리 안내" },
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.bannerBox}>
            <Text style={styles.bannerText}>{item.text}</Text>

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
    height: 280, // 고정 높이
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },

  bannerText: {
    fontSize: 16,
    color: "#2A7BE4",
    textAlign: "center",
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
