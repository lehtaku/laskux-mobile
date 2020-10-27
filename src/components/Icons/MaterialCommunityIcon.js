import React from 'react';

import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../../constants/Colors';

export default function MaterialCommunityIcon({name, size, color, iconStyle}) {
  return (
    <Icon
      name={name}
      size={size ? size : 22}
      color={color ? color : Colors.iconDefault}
      style={{...styles.icon, ...iconStyle}}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
  },
});
