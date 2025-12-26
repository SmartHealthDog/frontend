import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from "react-native";
import CustomButton from "./CustomButton";
import BlueButton from "./BlueButton";


interface PetProfileCardProps {
  name: string;
  type: string;
  gender: string;
  birth: string;
  imageUrl?: string | ImageSourcePropType | null;
  healthInfo?: string[];
  condition: string;
  onPressHistory?: () => void;
  onPressEdit?: () => void;
}

const PetProfileCard: React.FC<PetProfileCardProps> = ({
  name,
  type,
  gender,
  birth,
  imageUrl,
  healthInfo = [],
  condition,
  onPressHistory,
  onPressEdit,
}) => {
  const hasImage = !!imageUrl;

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        {/* 수정 아이콘 */}
        <TouchableOpacity style={styles.editBtn} onPress={onPressEdit}>
          <Image
            source={require("../assets/icon_edit.png")}
            style={styles.editIcon}
          />
        </TouchableOpacity>

        {/* 이미지 or 회색 원 */}
        {hasImage ? (
          <Image
            source={
              typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl
            }
            style={styles.petImage}
          />
        ) : (
          <View style={styles.petCircle} />
        )}

        {/* 이름 */}
        <Text style={styles.petName}>{name}</Text>
        <Text style={styles.petInfo}>{`${type} / ${gender} / ${birth}`}</Text>

        {/* 보건정보 */}
        <View style={styles.healthRow}>
        <Text style={styles.label}>보건정보 :</Text>

        <View style={styles.tagRow}>
            {healthInfo.map((item, idx) => (
              <BlueButton
                type="tag"
                key={idx}
                text={item}
                textColor="#FFFFFF"
                fontSize={14}
                style={{ marginRight: 8, marginBottom: 6 }}
                paddingVertical={4}
                paddingHorizontal={12}
              />
            ))}
        </View>
        </View>


        {/* 건강상태 */}
        <View style={styles.row}>
          <Text style={styles.label}>건강상태 :</Text>
          <Text style={styles.conditionText}>{condition}</Text>
        </View>

        {/* 최근 진단내역 버튼 */}
        <TouchableOpacity style={styles.historyBtn} onPress={onPressHistory}>
          <Text style={styles.historyBtnText}>최근 진단내역 보러가기</Text>
          <Image
            source={require("../assets/icon_right.png")}
            style={styles.smallRightIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PetProfileCard;

const styles = StyleSheet.create({

    cardWrapper: {
        width: "78%",             // 전체 화면보다 좁게
        alignSelf: "center",
      },

  card: {
    marginTop: 16,
    padding: 20,
    backgroundColor: "#FAFDFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#7DBFEA",
  },

  editBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: "#F1F1F1",  
    alignItems: "center",
    justifyContent: "center",
  },
  

  editIcon: {
    width: 12,
    height: 12,
    tintColor: "#666",
  },
  

  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
  },

  petCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
  },

  petName: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#040505",
    marginTop: 20,
  },

  petInfo: {
    textAlign: "center",
    color: "#777",
    marginTop: 4,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  label: {
    fontWeight: "600",
    fontSize: 16,
    marginRight: 6,
    color: "#333",
  },

  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  

  conditionText: {
    color: "#4A90E2",
    fontWeight: "600",
    fontSize: 16,
    
  },

  historyBtn: {
    marginTop: 20,
    backgroundColor: "#EEF7FD",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  historyBtnText: {
    color: "#0081D5",
    fontWeight: "600",
    lineHeight: 18,
    fontSize: 14,
  },

  smallRightIcon: {
    width: 12,
    height: 12,
    tintColor: "#0081D5",
    marginLeft: 8,
  },

});
