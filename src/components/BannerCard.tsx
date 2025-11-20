import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const BannerCard = () => {
  return (
    <View style={[styles.banner, { width: screenWidth, height: 288 }]}>
      <Text style={styles.bannerTitle}>오늘의 꿀팁</Text>
      <Text style={styles.bannerDesc}>반려동물 건강 관리 팁을 확인하세요!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 32,

  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  bannerDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
});

export default BannerCard;
