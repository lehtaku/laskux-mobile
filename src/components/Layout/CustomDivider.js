import React from 'react';

import {StyleSheet} from 'react-native';

import {Divider} from 'react-native-elements';

import Colors from '../../constants/Colors';

export default function CustomDivider({margin, marginBottom, marginTop}) {
  return <Divider style={{...styles.divider, marginVertical: margin, marginBottom, marginTop}} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.border,
    marginTop: 16,
    marginBottom: 16,
  },
});
