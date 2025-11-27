import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProfileEditScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* 🔙 헤더 */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../assets/icon_back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>내 프로필</Text>
        </View>

        {/* 이미지 */}
        <View style={styles.imageBox}>
          <View style={styles.imagePlaceholder} />

          <TouchableOpacity style={styles.editTag}>
            <Image
              source={require("../assets/icon_edit.png")}
              style={styles.editSmallIcon}
            />
            <Text style={styles.editTagText}>수정하기</Text>
          </TouchableOpacity>
        </View>

        {/* 닉네임 */}
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          placeholder="이서영"
          placeholderTextColor="#999"
        />

        {/* 이메일 */}
        <Text style={styles.label}>이메일 아이디</Text>
        <View style={styles.emailBox}>
          <Text style={styles.emailText}>822angel@gmail.com</Text>
        </View>

        {/* 주소 */}
        <Text style={styles.label}>내 주소</Text>
        <View style={styles.addressRow}>
          <TextInput
            style={styles.addressInput}
            placeholder="서울시 마포구 양xxxxx"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.changeAddressBtn}>
            <Text style={styles.changeAddressText}>주소 변경</Text>
          </TouchableOpacity>
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  backBtn: {
    marginRight: 12,
    padding: 4,
    marginTop: 6,
  },

  backIcon: {
    width: 20,
    height: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2024",
  },

  imageBox: {
    width: "100%",
    height: 180,
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ddd",
    opacity: 0.3,
    borderRadius: 12,
  },

  editTag: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  editTagText: {
    fontSize: 12,
    color: "#444",
    marginLeft: 4,
  },

  editSmallIcon: {
    width: 11,
    height: 11,
    tintColor: "#555",
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 12,
    color: "#1F2024",
  },

  input: {
    padding: 16,
    backgroundColor: "#F3F4F5",
    borderRadius: 10,
    fontSize: 16,
    color: "#7B7C7D",
    fontWeight: "500",
  },

  emailBox: {
    backgroundColor: "#F3F4F5",
    padding: 16,
    borderRadius: 10,
  },

  emailText: {
    fontSize: 16,
    color: "#7B7C7D",
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  addressInput: {
    flex: 1,
    backgroundColor: "#F3F4F5",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
    color: "#7B7C7D",
    fontWeight: "500",
  },

  changeAddressBtn: {
    borderWidth: 1,
    borderColor: "#C4C4C4",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },

  changeAddressText: {
    fontSize: 14,
    color: "#1F2024",
  },

  logoutText: {
    fontSize: 15,
    color: "#5A5A5A",
    textDecorationLine: "underline",
    marginTop: 28,
  },

  saveBtn: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: "#2A7BE4",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
