import React from 'react';

import {StyleSheet} from 'react-native';
import {ProgressView} from '@react-native-community/progress-view';
import {ProgressBar} from '@react-native-community/progress-bar-android';

import System from '../../constants/System';
import Colors from '../../constants/Colors';

export default function ProgressIndicator({progress}) {
  return System.os === 'ios' ? (
    <ProgressView
      progressTintColor={Colors.tintColor}
      progress={progress}
      trackTintColor={Colors.border}
    />
  ) : (
    <ProgressBar
      styleAttr="Horizontal"
      indeterminate={false}
      color={Colors.tintColor}
      progress={progress}
      style={styles.progressBarAndroid}
    />
  );
}

const styles = StyleSheet.create({
  progressBarAndroid: {
    height: 4,
  },
});
