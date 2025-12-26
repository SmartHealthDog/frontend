import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileCard = () => {
  return (
    <View style={styles.container}>
      
      {/* 프로필 이미지 */}
      <Image source={require('../assets/img_emblem.png')} style={styles.profileImage} />

      {/* 텍스트 영역 */}
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>다시 만나서 반가워요</Text>
        <Text style={styles.username}>한국항공대 님</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: '#E8E8E8',
  },

  textContainer: {
    marginLeft: 12,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'Pretendard-SemiBold',
  },

  username: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default ProfileCard;
