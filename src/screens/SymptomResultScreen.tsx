import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

import SymptomResultCard from '../components/SymptomResultCard';
import { useNavigation } from '@react-navigation/native';

const SymptomResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("강아지 식욕 저하");

  // 🔥 나중에 API 연결할 때 여기서 검색 결과 받아옴
  const mockResults = [
    {
      id: 1,
      title: "스트레스로 인한 식욕부진",
      content:
        "강아지, 고양이의 구강질환(치주염, 구내염)을 간단하게 진단..."
    },
    {
      id: 2,
      title: "강아지 식욕 부진 대처 방법",
      content:
        "강아지, 고양이의 구강질환을 간단하게 진단..."
    },
    {
      id: 3,
      title: "스트레스로 인한 식욕부진일 수 있어요",
      content:
        "식욕부진 내용입니다. 식욕부진 예시 본문에는..."
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 🔙 BACK + SEARCH (같은 줄) */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Image
            source={require('../assets/icon_back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="검색어를 입력하세요"
          />
          <Image
            source={require('../assets/icon_search.png')}
            style={styles.icon}
          />
        </View>
      </View>

      {/* 전체 개수 */}
      <Text style={styles.countText}>
        <Text style={styles.countNumber}>{mockResults.length}</Text>건 검색
      </Text>

      {/* 검색 카드 리스트 */}
      <View style={{ paddingHorizontal: 20 }}>
        {mockResults.map(item => (
          <SymptomResultCard
            key={item.id}
            title={item.title}
            content={item.content}
          />
        ))}
      </View>

      {/* 네비게이션바에 안가려지도록 여백 */}
      <View style={{ height: 80 }} />

    </ScrollView>
  );
};

export default SymptomResultScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F5',
    paddingTop: 48,
  },

  /* 🔥 새로 추가됨 */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#7B7C7D',
    marginRight: 12,
  },

  searchBox: {
    flex: 1, // 남은 공간 모두 차지
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  icon: {
    width: 20,
    height: 20,
    tintColor: '#7B7C7D',
  },

  countText: {
    fontSize: 14,
    color: '#3C4144',
    marginBottom: 12,
    paddingHorizontal: 20,
  },

  countNumber: {
    color: '#0081D5',
    fontWeight: '700',
  },
});
