import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const PetHealthCard = () => {
  return (
    <View style={styles.card}>

    {/* 왼쪽 프로필 */}
    <View style={styles.profilePlaceholder} />

    {/* 오른쪽 내용 영역 */}
    <View style={styles.contentBox}>

      {/* 이름 + (품종, 몸무게) */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>반려동물 이름 </Text>
        <Text style={styles.subInfo}>(품종, 몸무게)</Text>
      </View>

      {/* 태그 + + 버튼 */}
      <View style={styles.tagRow}>
        <View style={styles.tagBlue}>
          <Text style={styles.tagTextBlue}>태그1</Text>
        </View>

        <View style={styles.tagGray}>
          <Text style={styles.tagTextGray}>태그2</Text>
        </View>

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

    </View>

</View>

  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignSelf: 'flex-start', // ⬅ 내용만큼 width
    alignItems : 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCDEE0',
    backgroundColor: '#FFFFFF',

  },
  profilePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 48,
    backgroundColor: '#ECECEC', // 프로필 자리
  },

  contentBox: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, 
  },
  
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111', 
    // 진한 텍스트
  },
  
  subInfo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',   // 품종, 몸무게 텍스트 색
  },
  
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },

  tagBlue: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#0081D5',
    borderRadius: 32,
  },
  tagTextBlue: {
    fontSize: 14,
    color: '#FFF',
  },

  tagGray: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F4F4F4',
    borderRadius: 32,
  },
  tagTextGray: {
    fontSize: 14,
    color: '#555',
  },

  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#0081D5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addBtnText: {
    fontSize: 20,
    color: '#0081D5',
    fontWeight: '400',
  },
});

export default PetHealthCard;
