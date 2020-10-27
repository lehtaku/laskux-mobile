import React from 'react';

import {StyleSheet, View} from 'react-native';

import Colors from '../../constants/Colors';

import {DotIndicator} from 'react-native-indicators';

import TitleText from '../Text/TitleText';

export default function FloatingLoading({text}) {
  return (
    <View style={styles.container}>
      <TitleText text={text} />
      <View style={styles.indicatorContainer}>
        <DotIndicator color={Colors.tintColor} count={3} size={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    marginTop: 16,
    height: '5%',
  },
});
