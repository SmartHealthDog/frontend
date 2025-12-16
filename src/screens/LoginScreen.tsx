import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LogoAnimation from '../components/LogoAnimation';

type RootStackParamList = {
  Login: undefined;
  OrdinaryLogin: undefined;
  OrdinarySignup: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  // 애니메이션 값들
  const animationLayerOpacity = useRef(new Animated.Value(1)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직 (추후 구현)
    console.log('카카오 로그인 클릭');
  };

  const handleNormalLogin = () => {
    // OrdinaryLogin 화면으로 이동
    navigation.navigate('OrdinaryLogin');
  };

  const handleSignUp = () => {
    // OrdinarySignup 화면으로 이동
    navigation.navigate('OrdinarySignup');
  };

  const handleGoToHome = () => {
    // 개발용: Main(TabNavigator) 화면으로 바로 이동
    navigation.navigate('Main');
  };

  const handleAnimationComplete = () => {
    // 애니메이션 레이어 페이드 아웃 & 버튼 페이드 인 동시 실행
    Animated.parallel([
      Animated.timing(animationLayerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLoginForm(true);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* LogoAnimation 레이어 (페이드 아웃) */}
      <Animated.View 
        style={[
          styles.animationLayer,
          {
            opacity: animationLayerOpacity,
          },
        ]}
        pointerEvents={showLoginForm ? 'none' : 'auto'}
      >
        <LogoAnimation onAnimationComplete={handleAnimationComplete} />
      </Animated.View>

      {/* LoginScreen 레이어 (하단에 항상 존재) */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {/* 로고 영역 - 항상 렌더링 */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo_full.png')}
              style={styles.logoFull}
              resizeMode="contain"
            />
          </View>

          {/* 버튼 영역 - 페이드 인 */}
          <Animated.View 
            style={[
              styles.buttonContainer,
              {
                opacity: buttonsOpacity,
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.kakaoButton} 
              onPress={handleKakaoLogin}
              disabled={!showLoginForm}
            >
              <View style={styles.kakaoButtonContent}>
                <Image
                  source={require('../assets/logo_kakao.png')}
                  style={styles.kakaoIcon}
                  resizeMode="contain"
                />
                <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.normalButton} 
              onPress={handleNormalLogin}
              disabled={!showLoginForm}
            >
              <Text style={styles.normalButtonText}>로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signUpContainer} 
              onPress={handleSignUp}
              disabled={!showLoginForm}
            >
              <View style={styles.signUpTextContainer}>
                <Text style={styles.signUpText}>회원이 아니신가요?</Text>
                <Text style={styles.signUpLink}>회원가입</Text>
              </View>
            </TouchableOpacity>

            {/* 개발용 임시 버튼 */}
            <TouchableOpacity
              onPress={handleGoToHome}
              disabled={!showLoginForm}
              activeOpacity={0.7}
              style={styles.devLinkWrapper}
            >
              <Text style={styles.devLinkText}>로그인 없이 홈으로 가기</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  animationLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logoFull: {
    width: 139,
    height: 180,
  },
  formContainer: {
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#EAECEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  kakaoButton: {
    width: 300,
    height: 45,
    backgroundColor: '#FEE500',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },
  kakaoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Pretendard-SemiBold',
  },
  normalButton: {
    width: 300,
    height: 45,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAECEE',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 2,
  },
  normalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Pretendard-SemiBold',
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#7B7C7D',
    fontFamily: 'Pretendard-Regular',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 11,
    fontFamily: 'Pretendard-Bold',
  },
  devLinkWrapper: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devLinkText: {
    fontSize: 14,
    color: '#0081D5',
    fontWeight: '600',
  },
});

export default LoginScreen;
