import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';   

type SymptomNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'SymptomResult'
>;


const searchIcon = require('../assets/icon_search.png');

const SymptomSearchBox: React.FC = () => {

  const navigation = useNavigation<SymptomNavProp>();


  return (
    <View style={styles.container}>
      <Text style={styles.title}>증상검색</Text>
      <Text style={styles.description}>
        궁금한 증상에 대해 키워드로 검색해 보세요.
      </Text>

      {/* 🔥 검색창 전체를 눌리도록 TouchableOpacity로 감싸기 */}
      <TouchableOpacity
        style={styles.inputBox}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('SymptomResult')}
      >
        <Text style={styles.placeholder}>예) 강아지 식욕 저하</Text>
        <Image source={searchIcon} style={{ width: 20, height: 20 }} />
      </TouchableOpacity>
    </View>
  );
};

export default SymptomSearchBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 20,

    // 그림자
    shadowColor: '#B3B6B8',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  title: {
    fontWeight: '600',
    fontSize: 20,
    color: '#000',
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 16,
  },

  inputBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF7FF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  placeholder: {
    flex: 1,
    fontSize: 15,
    color: '#7B7C7D',
    fontFamily: 'Pretendard-Regular',
  },
});
