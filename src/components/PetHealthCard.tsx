import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { WALK_RECORDS_THIS_WEEK } from '../data/walkRecords';

const PetHealthCard = () => {
  const ppoppiRecord = useMemo(
    () =>
      WALK_RECORDS_THIS_WEEK.find((record) => record.petName === '뽀삐') ?? {
        petName: '뽀삐',
        petImage: require('../assets/img_adoptDog.png'),
      },
    []
  );

  const healthInfo = useMemo(
    () => ({
      weight: '체중 4.2kg ',
      vaccine: '예방접종 2025.11.28 완료',
    }),
    []
  );

  return (
    <View style={styles.card}>

    {/* 왼쪽 프로필 */}
    <Image source={ppoppiRecord.petImage} style={styles.profileImage} />

    {/* 오른쪽 내용 영역 */}
    <View style={styles.contentBox}>

      {/* 이름 + 서브타이틀 */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>{ppoppiRecord.petName}</Text>
        <Text style={styles.subInfo}>(골든리트리버, 5kg)</Text>
      </View>

      {/* 건강 정보 태그 */}
      <View style={styles.tagRow}>
        <View style={styles.tagBlue}>
          <Text style={styles.tagTextBlue}>{healthInfo.weight}</Text>
        </View>
      </View>

      <View style={styles.tagRow}>
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
  profileImage: {
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
    color: '#777', 
    marginLeft: 4,
  },
  
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    marginBottom: 2,
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

});

export default PetHealthCard;

