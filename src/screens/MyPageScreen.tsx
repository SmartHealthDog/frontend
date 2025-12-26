import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import PetProfileCard from "../components/PetProfileCard";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const SPACING = 16;

const MyPageScreen = () => {
  type MyPageNavProp = StackNavigationProp<RootStackParamList, "MyPage">;
  const navigation = useNavigation<MyPageNavProp>();

  const user = {
    name: "한국항공대",
    imageUrl: require("../assets/img_emblem.png"),
  };
  const hasUserImage = !!user.imageUrl;

  const petList = [
    {
      name: "뽀삐",
      type: "골든리트리버",
      gender: "여",
      birth: "25-11-04",
      imageUrl: require("../assets/img_adoptDog.png"),
      healthInfo: ["4.2kg", "치주염"],
      condition: "양호",
    },
    {
      name: "나비",
      type: "페르시안",
      gender: "남",
      birth: "2022-01-01",
      imageUrl: require("../assets/img_adoptCat.png"),
      healthInfo: ["슬개골", "알러지"],
      condition: "주의",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header />

      {/* 🔹 누르면 ProfileEditScreen으로 이동 */}
      <TouchableOpacity
        style={styles.userBox}
        onPress={() => navigation.navigate("ProfileEdit")}
        activeOpacity={0.8}
      >
        {hasUserImage ? (
          <Image
            source={
              typeof user.imageUrl === "string"
                ? { uri: user.imageUrl }
                : user.imageUrl
            }
            style={styles.userImage}
          />
        ) : (
          <View style={styles.userCircle} />
        )}

        <View style={styles.userRightBox}>
          <Text style={styles.userName}>{user.name}</Text>

          <Image
            source={require("../assets/icon_right.png")}
            style={styles.rightIcon}
          />
        </View>
      </TouchableOpacity>

      {/* 🔹 반려동물 프로필 */}
      <Text style={styles.sectionTitle}>반려동물 프로필</Text>

      {petList.length === 1 && <PetProfileCard {...petList[0]} />}

      {petList.length > 1 && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
            }}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const index = Math.round(x / (CARD_WIDTH + SPACING));
              setCurrentIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {petList.map((pet, idx) => (
              <View key={idx} style={{ width: CARD_WIDTH, marginRight: SPACING }}>
                <PetProfileCard
                  {...pet}
                  onPressEdit={() => navigation.navigate("PetEdit")}
                />
              </View>
            ))}
          </ScrollView>

          {/* Dots */}
          <View style={styles.dotContainer}>
            {petList.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, currentIndex === i && styles.activeDot]}
              />
            ))}
          </View>
        </>
      )}

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.btiSection}
        onPress={() => navigation.navigate("GameScreen")}
      >
        <Text style={styles.btiTitle}>멍냥 성향테스트</Text>
        <Text style={styles.btiDesc}>
          나와 가장 성격이 비슷한 강아지, 고양이는?!{"\n"}
          간단한 테스트로 알아보아요
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  /* -------------------------- 유저 영역 -------------------------- */
  userBox: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  userCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
  },

  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  userRightBox: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    flex: 1,
    justifyContent: "space-between",
  },

  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#040505",
  },

  rightIcon: {
    width: 16,
    height: 16,
    tintColor: "#7B7C7D",
  },

  /* -------------------------- 공통 스타일 -------------------------- */
  sectionTitle: {
    marginTop: 40,
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 20,
    color: "#000",
  },

  dotContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#C4C4C4",
  },

  activeDot: {
    backgroundColor: "#2A7BE4",
  },

  divider: {
    width: "100%",
    height: 6,
    backgroundColor: "#F3F4F5",
    marginTop: 32,
  },

  btiSection: {
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  btiTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  btiDesc: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
});
