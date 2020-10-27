import React from 'react';

import {Text, StyleSheet} from 'react-native';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

export default function LabelText({text, style, active}) {
  return <Text style={{...styles.text, ...style, ...(active && styles.active)}}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: Styles.fontSemiBold,
    fontSize: Styles.primaryFontSize,
  },
  active: {
    color: Colors.tintColor,
  },
});
