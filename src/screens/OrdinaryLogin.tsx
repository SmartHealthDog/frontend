import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import { login, isApiError } from '../api/auth';
import { storeAuthTokens } from '../storage/tokenStorage';

type RootStackParamList = {
  Login: undefined;
  OrdinaryLogin: undefined;
  Main: undefined;
};

type OrdinaryLoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrdinaryLogin'
>;

interface Props {
  navigation: OrdinaryLoginScreenNavigationProp;
}

const OrdinaryLogin: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = async () => {
    if (!isLoginEnabled || isLoading) return;

    setIsLoading(true);
    try {
      const tokens = await login(email, password);
      await storeAuthTokens(tokens);
      Alert.alert('로그인 완료', '환영합니다!', [
        {
          text: '확인',
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            }),
        },
      ]);
    } catch (error) {
      console.error('[login] 로그인 실패', error);
      if (isApiError(error)) {
        Alert.alert('로그인 실패', error.message);
      } else {
        Alert.alert('로그인 실패', '네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isLoginEnabled =
    email !== '' && password !== '' && emailError === '' && !isLoading;

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
        <Text style={styles.title}>로그인</Text>

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
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <CustomButton
          text="로그인"
          onPress={handleLogin}
          disabled={!isLoginEnabled}
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
    marginTop: 190,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 32,
    fontFamily: 'Pretendard-Bold',
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

export default OrdinaryLogin;

