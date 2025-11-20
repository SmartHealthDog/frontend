import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TitleBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.blue}>똑똑하</Text>
        <Text style={styles.yellow}>개 </Text>
        <Text style={styles.blue}>건강하</Text>
        <Text style={styles.yellow}>개</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
  },
  blue: {
    color: '#0081D5',
  },
  yellow: {
    color: '#FFC94D',
  },
});
