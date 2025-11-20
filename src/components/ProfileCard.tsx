import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileCard = () => {
  return (
    <View style={styles.container}>
      
      {/* 프로필 동그라미 */}
      <View style={styles.profileCircle} />

      {/* 텍스트 영역 */}
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>다시 만나서 반가워요</Text>
        <Text style={styles.username}>이서영 님</Text>
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

  profileCircle: {
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
