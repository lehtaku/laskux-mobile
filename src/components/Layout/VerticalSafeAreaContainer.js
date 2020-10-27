import React from 'react';

import {StyleSheet} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import Colors from '../../constants/Colors';

export default function VerticalSafeAreaContainer({children, style}) {
  return (
    <SafeAreaView style={{...styles.container, ...style}} forceInset={{vertical: 'always'}}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
