import React from 'react';

import {StyleSheet, View} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import Colors from '../../constants/Colors';

export default function BottomSafeAreaContainer({children}) {
  return (
    <SafeAreaView style={styles.wrapper} forceInset={{bottom: 'always', top: 'never'}}>
      <View style={styles.container} children={children} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  container: {
    backgroundColor: Colors.screenBackground,
    height: '100%',
  },
});
