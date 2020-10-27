import React from 'react';

import {StyleSheet, View} from 'react-native';

import Colors from '../../constants/Colors';

import {DotIndicator} from 'react-native-indicators';

import Styles from '../../constants/Styles';

import LabelText from '../Text/LabelText';

export default function Loading({text}) {
  return (
    <View style={styles.container}>
      <LabelText text={text} style={styles.text} />
      <View style={styles.indicatorContainer}>
        <DotIndicator color={Colors.tintColor} count={3} size={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.gray,
    fontFamily: Styles.fontBold,
  },
  indicatorContainer: {
    marginTop: 16,
    height: '5%',
  },
});
