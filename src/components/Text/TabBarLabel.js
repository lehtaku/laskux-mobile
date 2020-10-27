import React from 'react';

import {Text, StyleSheet} from 'react-native';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

export default function TabBarLabel({text, focused}) {
  return (
    <Text style={{...styles.text, color: focused ? Colors.tintColor : Colors.deepBlue}}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Styles.fontRegular,
    fontSize: Styles.tabBarLabelSize,
    marginBottom: 4,
  },
});
