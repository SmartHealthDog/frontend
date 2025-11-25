import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface Props {
  name: string;
  rating: number;
  address: string;
  phone: string;
  image: any;
  onPress?: () => void;
}

const HospitalCard: React.FC<Props> = ({ name, rating, address, phone, image, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      
      {/* 왼쪽 기관 이미지 */}
      <Image source={image} style={styles.image} />

      {/* 오른쪽 정보 영역 */}
      <View style={styles.infoContainer}>

        <Text style={styles.name}>{name}</Text>

        {/* 별점 */}
        <View style={styles.row}>
          <Image
            source={require('../assets/icon_rating.png')}
            style={styles.star}
          />
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
        </View>

        {/* 주소 */}
        <Text style={styles.address}>{address}</Text>

        {/* 전화번호 박스 */}
        <View style={styles.phoneBox}>
          <Image
            source={require('../assets/icon_phoneNum.png')}
            style={styles.phoneIcon}
          />
          <Text style={styles.phoneText}>{phone}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

export default HospitalCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
        width: '100%',        // ★ 고정 폭(350) 제거 → 전체화면 꽉 채움
      },
      
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
  },
  infoContainer: {
    marginLeft: 18,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  star: {
    width: 16,
    height: 16,
  },
  rating: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  address: {
    fontSize: 14,
    color: '#7B7C7D',
    marginBottom: 6,
  },
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF7FD',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  phoneIcon: {
    width: 14,
    height: 14,
  },
  phoneText: {
    fontSize: 14,
    color: '#7B7C7D',
    fontWeight: '500',
    marginLeft: 5,
  },
});
