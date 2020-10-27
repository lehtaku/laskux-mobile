import React from 'react';

import {Text, StyleSheet} from 'react-native';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

export default function PrimaryText({text, style}) {
  return <Text style={{...styles.text, ...style}}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: Styles.fontRegular,
    fontSize: Styles.primaryFontSize,
    lineHeight: 20,
  },
});
