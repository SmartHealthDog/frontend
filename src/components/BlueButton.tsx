import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomButtonProps {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  width?: number;
  type?: "primary" | "tag";
  backgroundColor?: string;
  textColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  fontSize?: number;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress = () => {},
  disabled = false,
  width = 310,
  type = "primary",
  backgroundColor = "#0081D5",
  textColor = "#FFFFFF",
  paddingHorizontal = 16,
  paddingVertical = 12,
  fontSize = 18,
  style,
}) => {

  // 📌 "tag" 스타일일 때는 자동으로 크기가 텍스트 크기만큼 줄어듦
  const tagStyle: ViewStyle = {
    backgroundColor,
    paddingHorizontal,
    paddingVertical,
    borderRadius: 20,
    alignSelf: "flex-start",
  };

  const primaryStyle: ViewStyle = {
    backgroundColor: disabled ? "#E1E1E1" : backgroundColor,
    width,
    height: 55,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <TouchableOpacity
      style={[
        type === "tag" ? tagStyle : primaryStyle,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: '500',
  },
});

export default CustomButton;
