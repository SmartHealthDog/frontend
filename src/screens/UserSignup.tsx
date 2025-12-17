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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import CustomButton from '../components/CustomButton';

type RootStackParamList = {
  Login: undefined;
  OrdinaryLogin: undefined;
  OrdinarySignup: undefined;
  UserSignup: {
    email: string;
    password: string;
    verificationCode: string;
    profileImage?: string | null;
  };
  PetSignup: {
    email: string;
    password: string;
    verificationCode: string;
    nickname: string;
    profileImage?: string | null;
  };
};

type UserSignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserSignup'
>;

interface Props {
  navigation: UserSignupScreenNavigationProp;
  route: {
    params: {
      email: string;
      password: string;
      verificationCode: string;
      profileImage?: string | null;
    };
  };
}

const UserSignup: React.FC<Props> = ({ navigation, route }) => {
  const { email, password, verificationCode, profileImage: initialProfileImage } =
    route.params;
  const [profileImage, setProfileImage] = useState<string | null>(
    initialProfileImage || null
  );
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

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
            message: '프로필 사진을 선택하기 위해 사진 라이브러리 접근 권한이 필요합니다.',
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
            message: '프로필 사진을 선택하기 위해 저장공간 접근 권한이 필요합니다.',
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
            setProfileImage(uri);
          }
        }
      }
    );
  };

  const validateNickname = (text: string) => {
    setNickname(text);
    
    if (text === '') {
      setNicknameError('');
      return;
    }

    if (text.length < 3) {
      setNicknameError('닉네임은 최소 3자 이상이어야 합니다.');
    } else if (text.length > 128) {
      setNicknameError('닉네임은 128자를 초과할 수 없습니다.');
    } else {
      setNicknameError('');
    }
  };

  const handleNext = () => {
    navigation.navigate('PetSignup', {
      email,
      password,
      verificationCode,
      nickname,
      profileImage,
    });
  };

  const isNextEnabled = nickname !== '' && nicknameError === '';

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
          <Text style={styles.title}>프로필을{'\n'}작성해 주세요</Text>
        </View>

        <TouchableOpacity 
          style={styles.imagePickerContainer}
          onPress={handleImagePick}
        >
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }}
              style={styles.profileImage}
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
            placeholder="닉네임을 입력해 주세요"
            placeholderTextColor="#7B7C7D"
            value={nickname}
            onChangeText={validateNickname}
            maxLength={129}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {nicknameError !== '' && (
            <Text style={styles.errorText}>{nicknameError}</Text>
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
    marginTop: 140,
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
  profileImage: {
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
});

export default UserSignup;

