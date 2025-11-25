import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  description: string;
  image: any;
  imageType?: 'eye' | 'urine';   // 👉 이미지 크기+위치 구분용
  style?: any;
  onPress?: () => void; 
}

const DiagnosisCard: React.FC<Props> = ({ title, description, image, imageType = 'eye', style, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>

      {/* 이미지 */}
      <Image
        source={image}
        style={[
          imageType === "eye" ? styles.eyePosition : styles.urinePosition
        ]}
      />
    </TouchableOpacity>
  );
};

export default DiagnosisCard;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 240,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    overflow: 'visible',

    shadowColor: '#B3B6B8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 16,

    // ⭐ SHADOW (Android)
    elevation: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#000',
    marginBottom: 8,
  },

  cardDesc: {
    fontSize: 14,
    color: '#7B7C7D',
    marginBottom: 20,
    lineHeight: 22,
  },

  /* ----------------------------
     ✨ 이미지별 위치·크기 분리 
  -----------------------------*/

  // 👁 안구질환 강아지
  eyePosition: {
    width: 88,
    height: 88,
    position: 'absolute',
    bottom: 8,       // ★ 원하는 높이로 조절
    left: 80,
    right: 0,
  },

  // 🧪 소변키트 강아지
  urinePosition: {
    width: 85,
    height: 100,
    position: 'absolute',
    bottom: -0,     // ★ 원하는 높이로 조절
    left: 75,
    right: 0,
    
  },
});
