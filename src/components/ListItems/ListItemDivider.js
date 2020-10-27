import React from 'react';

import {StyleSheet} from 'react-native';

import {ListItem} from 'react-native-elements';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

export default function ListItemDivider({
  title,
  rightTitle,
  style,
  borders,
  bottomBorder,
  topBorder,
}) {
  return (
    <ListItem
      containerStyle={{
        ...styles.container,
        ...(borders && styles.topBorder),
        ...(borders && styles.bottomBorder),
        ...(bottomBorder && styles.bottomBorder),
        ...(topBorder && styles.topBorder),
        ...style,
      }}
      title={title}
      titleStyle={styles.title}
      rightTitle={rightTitle}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBlue,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  topBorder: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.border,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.border,
  },
  title: {
    color: Colors.gray,
    fontFamily: Styles.fontSemiBold,
  },
});
