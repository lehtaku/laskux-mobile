import React from 'react';

import {Text, StyleSheet} from 'react-native';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

export default function LabelError({text, style}) {
  return <Text style={{...styles.text, ...style}}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: Colors.danger,
    fontFamily: Styles.fontRegular,
    fontSize: Styles.secondaryFontSize,
  },
});
