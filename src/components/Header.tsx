import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/logo_navTop.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  logo: {
    height: 28,
    width: 143,
  },
});

export default Header;

