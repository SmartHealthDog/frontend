
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";

const urineDog = require("../assets/urineDog.png");

const UrineDiagnosisScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
      {/* 🔙 Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Image
          source={require("../assets/icon_back.png")}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>소변키트 진단</Text>

      {/* 설명 문구 */}
      <Text style={styles.subtitle}>
        소변키트 진단 서비스는 앱 내에서{"\n"}
        반려동물의 건강 상태를 분석해주는 서비스입니다.
      </Text>
 
      {/* 캐릭터 이미지 */}
      <Image source={urineDog} style={styles.image} />

      {/* 진단 시작 버튼 */}
      <View style={{ marginTop: 50 }}>
        <CustomButton 
          text="진단시작"
          onPress={() => console.log("소변 진단 시작")}
        />
      </View>

    </View>
  );
};

export default UrineDiagnosisScreen;


// ====================== STYLE ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: 80,
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    padding: 6,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
    marginTop: 70,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#3C4144",
    textAlign: "center",
    marginTop: 24,
    lineHeight: 26,
  },

  image: {
    width: 350,
    height: 350,
    marginTop: 60,
    resizeMode: "contain",
  },
});


