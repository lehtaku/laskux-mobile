import React from 'react';

import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Colors from '../../constants/Colors';

export default function FeatherIcon({name, size, color}) {
  return (
    <Icon
      name={name}
      style={styles.icon}
      size={size ? size : 22}
      color={color ? color : Colors.iconDefault}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
  },
});
