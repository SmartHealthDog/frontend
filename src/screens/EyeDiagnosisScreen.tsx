import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EyeDiagnosisScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>안구질환 진단 화면</Text>
    </View>
  );
};

export default EyeDiagnosisScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 22, fontWeight: '600' }
});
