import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App"; // 경로는 네 프로젝트 구조에 맞게 조절



const eyeDog = require("../assets/eyeDog.png");

const EyeDiagnosisScreen = () => {

const navigation = useNavigation<any>();  // ★ navigation 사용

  return (
    <View style={styles.container}>
      
      {/* Back Button */}
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
      <Text style={styles.title}>안구질환 진단</Text>

      {/* 설명 문구 */}
      <Text style={styles.subtitle}>
        안구질환 진단 서비스는 앱 내에서{"\n"}
        촬영 후 AI를 사용해 진단해주는 서비스입니다.
      </Text>

      {/* 캐릭터 이미지 */}
      <Image source={eyeDog} style={styles.image} />

      {/* 진단 시작 버튼 */}
      <View style={{ marginTop: 100 }}>
        <CustomButton 
          text="진단시작"
          onPress={() => navigation.navigate("EyeCamera")}
        />
      </View>

    </View>
  );
};

export default EyeDiagnosisScreen;

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
    width: 250,
    height: 250,
    marginTop: 90,
    resizeMode: "contain",
  },
});
