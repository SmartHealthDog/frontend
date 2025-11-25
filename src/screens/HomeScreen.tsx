console.log("📢 HomeScreen Loaded");
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import PetHealthCard from '../components/PetHealthCard';
import ProfileCard from '../components/ProfileCard';
import BannerSlider from '../components/BannerSlider';
import Header from '../components/Header';


export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header />

      {/* 전체 컨텐츠 영역 */}
      <View style={styles.contentWrap}>
        <ProfileCard />

        <Text style={styles.sectionTitle}>반려동물 보건정보</Text>

        <PetHealthCard />
      </View>

      {/* 🔹 divider는 화면 전체폭 */}
      <View style={styles.divider} />

      {/* divider 밑 공간도 다시 20 좌우 */}
    

      <BannerSlider />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentWrap: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 32,
    marginBottom: 16,
  },

  divider: {
    width: '100%',     
    height: 6,
    backgroundColor: '#F3F4F5',
    marginTop: 32,    
  },
});
