import React from 'react';

import {StyleSheet, Text} from 'react-native';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

export default function TitleText({text, style}) {
  return <Text style={{...styles.text, ...style}}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: Colors.deepBlue,
    fontFamily: Styles.fontSemiBold,
    fontSize: Styles.titleSize,
    marginBottom: 8,
  },
});
