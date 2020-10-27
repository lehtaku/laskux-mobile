import React from 'react';

import {StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';

import Colors from '../../constants/Colors';

export default function DrawerNavigatorIcon({name, focused, size}) {
  return (
    <Icon
      name={name}
      size={size}
      style={styles.tabIcon}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

const styles = StyleSheet.create({
  tabIcon: {},
});
