import React from 'react';

import {StyleSheet, View} from 'react-native';

import Colors from '../../constants/Colors';

import TitleText from '../Text/TitleText';
import ProgressIndicator from '../Indicators/ProgressIndicator';
import Styles from '../../constants/Styles';

export default function StepHeader({title, subtitle, progress}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TitleText text={title} style={styles.title} />
        <TitleText text={subtitle} style={styles.subtitle} />
      </View>
      <ProgressIndicator progress={progress} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  title: {
    color: Colors.tintColor,
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 0,
    fontSize: 22,
    fontFamily: Styles.fontRegular,
    letterSpacing: 2,
  },
  subtitle: {
    color: Colors.tintColor,
    textAlign: 'center',
    marginTop: 0,
    fontSize: 22,
    fontFamily: Styles.fontRegular,
    marginBottom: 0,
    letterSpacing: 7.5,
  },
});
