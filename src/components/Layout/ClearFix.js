import React from 'react';

import {StyleSheet, View} from 'react-native';

export default function ClearFix({innerRef}) {
  return <View ref={innerRef} style={styles.clearFix} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
  },
});
