import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';

type RootStackParamList = {
  Login: undefined;
  OrdinaryLogin: undefined;
  OrdinarySignup: undefined;
  UserSignup: undefined;
};

type OrdinarySignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrdinarySignup'
>;

interface Props {
  navigation: OrdinarySignupScreenNavigationProp;
}

const OrdinarySignup: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    
    if (text === '') {
      setEmailError('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|kr|net|org|edu|gov|mil|co\.kr|ac\.kr|go\.kr|or\.kr)$/i;
    
    if (!emailRegex.test(text)) {
      setEmailError('잘못된 이메일 형식입니다.');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    
    if (text === '') {
      setPasswordError('');
      return;
    }

    if (text.length < 6 || text.length > 15) {
      setPasswordError('잘못된 비밀번호 형식입니다.');
    } else {
      setPasswordError('');
    }
  };

  const handleNext = () => {
    navigation.navigate('UserSignup');
  };

  const isNextEnabled = email !== '' && password !== '' && emailError === '' && passwordError === '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/icon_navBack.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>이메일과 비밀번호를{'\n'}입력하세요</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="이메일 주소를 입력해 주세요"
            placeholderTextColor="#7B7C7D"
            value={email}
            onChangeText={validateEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError !== '' && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해 주세요"
            placeholderTextColor="#7B7C7D"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {passwordError !== '' && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
        </View>

        <CustomButton
          text="다음"
          onPress={handleNext}
          disabled={!isNextEnabled}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navBar: {
    marginTop: 50,
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 20,
    padding: 10,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  content: {
    alignItems: 'center',
    marginTop: 170,
  },
  titleContainer: {
    width: 310,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Pretendard-Bold',
    lineHeight: 37.2,
    textAlign: 'left',
  },
  inputContainer: {
    width: 310,
    marginBottom: 40,
  },
  input: {
    width: 310,
    height: 44,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#B3B6B8',
    paddingVertical: 10,
    paddingHorizontal: 0,
    fontFamily: 'Pretendard-Medium',
  },
  errorText: {
    fontSize: 12,
    color: '#EF5F5F',
    marginTop: 8,
    fontFamily: 'Pretendard-Regular',
  },
});

export default OrdinarySignup;

