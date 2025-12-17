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
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../components/CustomButton';
import { registerUser, isApiError } from '../api/auth';

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
    profileImage?: string | null;
  };
};

type PetSignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PetSignup'
>;

interface Props {
  navigation: PetSignupScreenNavigationProp;
  route: {
    params: {
      email: string;
      password: string;
      verificationCode: string;
      nickname: string;
      profileImage?: string | null;
    };
  };
}

const PetSignup: React.FC<Props> = ({ navigation, route }) => {
  const { email, password, verificationCode, nickname, profileImage } =
    route.params;
  const [petImage, setPetImage] = useState<string | null>(null);
  const [petName, setPetName] = useState('');
  const [petNameError, setPetNameError] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [breed, setBreed] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requestAndroidPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const androidVersion = Platform.Version;
      
      if (androidVersion >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: '사진 라이브러리 접근 권한',
            message: '반려동물 사진을 선택하기 위해 사진 라이브러리 접근 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: '저장공간 접근 권한',
            message: '반려동물 사진을 선택하기 위해 저장공간 접근 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('권한 요청 에러:', err);
      return false;
    }
  };

  const handleImagePick = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestAndroidPermissions();
      if (!hasPermission) {
        Alert.alert(
          '권한 필요',
          '사진을 선택하려면 저장공간 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.'
        );
        return;
      }
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        maxWidth: 500,
        maxHeight: 500,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('이미지 선택 취소');
        } else if (response.errorCode) {
          console.log('이미지 선택 에러:', response.errorMessage);
          Alert.alert('오류', '이미지를 불러올 수 없습니다.');
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            setPetImage(uri);
          }
        }
      }
    );
  };

  const validatePetName = (text: string) => {
    setPetName(text);
    
    if (text === '') {
      setPetNameError('');
      return;
    }

    if (text.length > 20) {
      setPetNameError('반려동물의 이름은 20자를 초과할 수 없습니다.');
    } else {
      setPetNameError('');
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const handleRegister = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      await registerUser({
        email,
        password,
        nickname,
        emailVerificationToken: verificationCode,
        profilePictureUri: profileImage ?? null,
      });
      Alert.alert('회원가입 완료', '회원가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]);
    } catch (error) {
      console.error('[signup] 회원가입 실패', error);
      if (isApiError(error)) {
        Alert.alert('오류', error.message);
      } else {
        Alert.alert('오류', '네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    handleRegister();
  };

  const handleNoPet = () => {
    handleRegister();
  };

  const isCompleteEnabled = petName !== '' && petNameError === '' && birthday !== null && breed !== '';

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
          <Text style={styles.title}>반려동물을{'\n'}등록해 주세요</Text>
        </View>

        <TouchableOpacity 
          style={styles.imagePickerContainer}
          onPress={handleImagePick}
        >
          {petImage ? (
            <Image 
              source={{ uri: petImage }}
              style={styles.petImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Image
                source={require('../assets/icon_camera.png')}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="반려동물의 이름을 입력해 주세요"
            placeholderTextColor="#7B7C7D"
            value={petName}
            onChangeText={validatePetName}
            maxLength={21}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {petNameError !== '' && (
            <Text style={styles.errorText}>{petNameError}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                style={styles.input}
                placeholder="생일을 입력해 주세요"
                placeholderTextColor="#7B7C7D"
                value={formatDate(birthday)}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthday || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          {Platform.OS === 'ios' && showDatePicker && (
            <TouchableOpacity
              style={styles.datePickerConfirmButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerConfirmText}>확인</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="품종을 입력해 주세요"
            placeholderTextColor="#7B7C7D"
            value={breed}
            onChangeText={setBreed}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0081D5" />
          </View>
        ) : (
          <>
            <CustomButton
              text="완료"
              onPress={handleComplete}
              disabled={!isCompleteEnabled}
            />

            <TouchableOpacity 
              style={styles.noPetButton}
              onPress={handleNoPet}
            >
              <Text style={styles.noPetText}>반려동물이 없어요</Text>
            </TouchableOpacity>
          </>
        )}
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
    marginTop: 80,
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
  imagePickerContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 40,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    width: 32,
    height: 32,
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
  datePickerConfirmButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    padding: 10,
  },
  datePickerConfirmText: {
    fontSize: 16,
    color: '#0081D5',
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
  noPetButton: {
    marginTop: 20,
  },
  noPetText: {
    color: '#040505',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    width: 310,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PetSignup;

