import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

const GameScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>멍냥 성향테스트</Text>

      <Text style={styles.desc}>
        앞으로 여기서 반려동물 성격 유형을 알아보는{"\n"}
        간단한 테스트를 진행할 수 있어요!
      </Text>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },

  desc: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
});
