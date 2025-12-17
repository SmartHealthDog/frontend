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
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import { sendEmailVerification, isApiError } from '../api/auth';

type RootStackParamList = {
  Login: undefined;
  OrdinaryLogin: undefined;
  OrdinarySignup: undefined;
  UserSignup: {
    email: string;
    password: string;
    verificationCode: string;
  };
  PetSignup: {
    email: string;
    password: string;
    verificationCode: string;
    nickname: string;
  };
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
  const [showVerificationField, setShowVerificationField] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
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

  const validatePassword = (text: string) => {
    setPassword(text);
    
    if (text === '') {
      setPasswordError('');
      return;
    }

    // 8-256자 검사
    if (text.length < 8 || text.length > 256) {
      setPasswordError('비밀번호는 8-256자여야 합니다.');
      return;
    }

    // 영 대문자 포함 검사
    if (!/[A-Z]/.test(text)) {
      setPasswordError('비밀번호는 영 대문자를 포함해야 합니다.');
      return;
    }

    // 영 소문자 포함 검사
    if (!/[a-z]/.test(text)) {
      setPasswordError('비밀번호는 영 소문자를 포함해야 합니다.');
      return;
    }

    // 숫자 포함 검사
    if (!/[0-9]/.test(text)) {
      setPasswordError('비밀번호는 숫자를 포함해야 합니다.');
      return;
    }

    // 특수문자 포함 검사
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(text)) {
      setPasswordError('비밀번호는 특수문자를 포함해야 합니다.');
      return;
    }

    setPasswordError('');
  };

  const handleVerification = async () => {
    if (email !== '' && emailError === '') {
      setIsLoading(true);
      
      try {
        await sendEmailVerification(email);
        setShowVerificationField(true);
        Alert.alert('인증 코드 전송', '인증 코드가 이메일로 전송되었습니다.');
      } catch (error) {
        console.error('[signup] 이메일 인증 요청 실패', error);
        if (isApiError(error)) {
          Alert.alert('오류', error.message);
        } else {
          Alert.alert('오류', '네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNext = () => {
    navigation.navigate('UserSignup', {
      email,
      password,
      verificationCode,
    });
  };

  const isNextEnabled = email !== '' && password !== '' && emailError === '' && passwordError === '' && verificationCode !== '';

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
          <View style={styles.emailInputWrapper}>
            <TextInput
              style={styles.emailInput}
              placeholder="이메일 주소를 입력해 주세요"
              placeholderTextColor="#7B7C7D"
              value={email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={[
                styles.verificationButton,
                (email === '' || emailError !== '' || isLoading) ? styles.verificationButtonDisabled : null
              ]}
              onPress={handleVerification}
              disabled={email === '' || emailError !== '' || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[
                  styles.verificationButtonText,
                  (email === '' || emailError !== '' || isLoading) ? styles.verificationButtonTextDisabled : null
                ]}>
                  인증
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {emailError !== '' && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}
        </View>

        {showVerificationField && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="인증 코드를 입력해 주세요"
              placeholderTextColor="#7B7C7D"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

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
  emailInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#B3B6B8',
    paddingVertical: 10,
    paddingHorizontal: 0,
    fontFamily: 'Pretendard-Medium',
    marginRight: 12,
  },
  verificationButton: {
    backgroundColor: '#0081D5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  verificationButtonDisabled: {
    backgroundColor: '#E1E1E1',
  },
  verificationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
  verificationButtonTextDisabled: {
    color: '#B3B6B8',
  },
  errorText: {
    fontSize: 12,
    color: '#EF5F5F',
    marginTop: 8,
    fontFamily: 'Pretendard-Regular',
  },
});

export default OrdinarySignup;

