import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const PetEditScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image
            source={require("../assets/icon_back.png")}
            style={styles.backIcon}
            />
        </TouchableOpacity>

        <Text style={styles.title}>반려동물 프로필</Text>
      </View>

      {/* 📌 이미지 + 수정하기 버튼 */}
      <View style={styles.imageBox}>
        <View style={styles.petImagePlaceholder} />
        <TouchableOpacity style={styles.editTag}>
          <Text style={styles.editTagText}>수정하기</Text>
        </TouchableOpacity>
      </View>

      {/* 📌 이름 */}
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="나비"
        placeholderTextColor="#999"
      />

      {/* 📌 견종 */}
      <Text style={styles.label}>견종</Text>
      <TextInput
        style={styles.input}
        placeholder="치와와"
        placeholderTextColor="#999"
      />

      {/* 📌 성별 */}
      <Text style={styles.label}>성별</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.radioBtn}>
          <Text style={styles.radioText}>여자</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioBtn}>
          <Text style={styles.radioText}>남자</Text>
        </TouchableOpacity>
      </View>

      {/* 📌 생일 */}
      <Text style={styles.label}>생일</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.birthInput}
          placeholder="2020"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.birthInput}
          placeholder="8월"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.birthInput}
          placeholder="22일"
          placeholderTextColor="#999"
        />
      </View>

      {/* 📌 중성화 */}
      <Text style={styles.label}>중성화</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.radioBtn}>
          <Text style={styles.radioText}>했어요</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioBtn}>
          <Text style={styles.radioText}>안했어요</Text>
        </TouchableOpacity>
      </View>

      {/* 📌 보건정보 */}
      <Text style={styles.label}>보건정보</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.healthTag}>
          <Text style={{ color: "#fff" }}>치주염</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addTagBtn}>
          <Text style={styles.addTagText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>저장하기</Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />

    </ScrollView>
  );
};

export default PetEditScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  backBtn: { 
    marginRight: 12,
    marginTop: 14,
  },

  backIcon: { width: 20, height: 20 },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    color: "#1F2024",
  },

  petImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
  },

  imageBox: {
    width: "100%",
    height: 180,
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop:20,
  },

  editTag: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editTagText: { fontSize: 12, color: "#444" },

  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 20,
    color: "#2F3036",
  },

  input: {
    padding: 16,
    backgroundColor: "#F3F4F5",
    borderRadius: 10,
    fontSize: 16,
    color: "#7B7C7D", // <-- 입력 텍스트 색
    fontWeight: "500",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  radioBtn: {
    width: "48%",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  radioText: {
    color: "#1F2024",
    fontSize: 16,
  },

  birthInput: {
    width: "30%",
    backgroundColor: "#F3F4F5",
    padding: 14,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 16,
    color: "#7B7C7D", // <-- 입력 텍스트 색
    fontWeight: "500",
  },

  healthTag: {
    backgroundColor: "#0081D5",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  addTagBtn: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0081D5",   
    justifyContent: "center",
    alignItems: "center",
  },

  addTagText: {
    fontSize: 18,
    color: "#0081D5",          
    marginTop: -4,
  },

  saveBtn: {
    backgroundColor: "#0081D5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

});

