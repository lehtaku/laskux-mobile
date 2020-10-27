import React from 'react';

import {StyleSheet, View} from 'react-native';

import Colors from '../../constants/Colors';

import {DotIndicator} from 'react-native-indicators';

import Logo from '../../assets/images/logo/laskux-logo-white.svg';

export default function LaunchingLoader() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width="100%" height="100%" />
      </View>
      <View style={styles.indicatorContainer}>
        <DotIndicator color={Colors.white} count={3} size={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
  },
  logoContainer: {
    width: '50%',
    aspectRatio: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    marginTop: 16,
    height: '5%',
  },
});
