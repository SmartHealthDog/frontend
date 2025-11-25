import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  label: string;           // 버튼에 표시될 텍스트
  onPress: () => void;     // 누르면 열리는 드롭다운
  disabled?: boolean;      // 지역 선택 안되면 군구 비활성화
  style?: ViewStyle;       // 필요하면 외부 스타일 추가
}

const DropdownButton: React.FC<Props> = ({ label, onPress, disabled, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
      <Image
        source={require('../assets/icon_arrowDown.png')}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export default DropdownButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabled: { opacity: 0.4 },

  label: {
    fontSize: 14,
    color: '#555',
    marginRight: 6,
  },

  icon: {
    width: 12,
    height: 12,
  },
});
