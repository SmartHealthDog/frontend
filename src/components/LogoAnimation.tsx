import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LogoAnimationProps {
  onAnimationComplete: () => void;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ onAnimationComplete }) => {
  // 애니메이션 값들
  const logoTextOpacity = useRef(new Animated.Value(0)).current;
  const logoBulbOpacity = useRef(new Animated.Value(0)).current;
  const logoBulbTranslateY = useRef(new Animated.Value(50)).current;
  
  // 현재 단계 상태
  const [currentStep, setCurrentStep] = useState(1);
  const [showBulbFull, setShowBulbFull] = useState(false);
  const [showLogoFull, setShowLogoFull] = useState(false);

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    // 1단계: logo_text 나타남 (0.5초)
    Animated.timing(logoTextOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(2);
      // 2단계: logo_bulb 슬라이딩 (0.8초)
      Animated.parallel([
        Animated.timing(logoBulbOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoBulbTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(3);
        // 3단계: logo_bulbFull 변환 (0.3초)
        setTimeout(() => {
          setShowBulbFull(true);
          setTimeout(() => {
            setCurrentStep(4);
            // 4단계: logo_full로 즉시 교체하고 완료 콜백 호출
            setShowLogoFull(true);
            // 다음 프레임에서 완료 콜백 호출 (렌더링 완료 보장)
            requestAnimationFrame(() => {
              setTimeout(() => {
                onAnimationComplete();
              }, 50);
            });
          }, 300);
        }, 200);
      });
    });
  };

  return (
    <View style={styles.container}>
      {/* 전체 컨텐츠를 감싸는 컨테이너 */}
      <View style={styles.contentWrapper}>
        {/* 애니메이션 로고 컨테이너 */}
        <View style={styles.logoContainer}>
          {!showLogoFull ? (
            <>
              {/* logo_bulb / logo_bulbFull */}
              <Animated.View
                style={[
                  styles.logoBulbContainer,
                  {
                    opacity: logoBulbOpacity,
                    transform: [{ translateY: logoBulbTranslateY }],
                  },
                ]}
              >
                <Image
                  source={
                    showBulbFull 
                      ? require('../assets/logo_bulbFull.png')
                      : require('../assets/logo_bulb.png')
                  }
                  style={styles.logoBulb}
                  resizeMode="contain"
                />
              </Animated.View>

              {/* logo_text */}
              <Animated.View
                style={[
                  styles.logoTextContainer,
                  {
                    opacity: logoTextOpacity,
                  },
                ]}
              >
                <Image
                  source={require('../assets/logo_text.png')}
                  style={styles.logoText}
                  resizeMode="contain"
                />
              </Animated.View>
            </>
          ) : (
            /* logo_full (최종 단계) - 즉시 교체 */
            <View style={styles.logoFullContainer}>
              <Image
                source={require('../assets/logo_full.png')}
                style={styles.logoFull}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
    height: 180,
  },
  logoTextContainer: {
    width: 139,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    width: 139,
    height: 96,
  },
  logoBulbContainer: {
    width: 80,
    height: 80,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBulb: {
    width: 80,
    height: 80,
  },
  logoFullContainer: {
    width: 139,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoFull: {
    width: 139,
    height: 180,
  },
});

export default LogoAnimation;
