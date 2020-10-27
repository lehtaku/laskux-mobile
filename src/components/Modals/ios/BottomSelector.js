import React from 'react';

import {View, StyleSheet} from 'react-native';

import {Overlay} from 'react-native-elements';

import Layout from '../../../constants/Layout';

import InputDoneButton from '../../Buttons/InputDoneButton';

export default function BottomSelector({isVisible, onDone, onCancel, children}) {
  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
      animationType="fade"
      onBackdropPress={onCancel}>
      <>
        <InputDoneButton onPress={onDone} />
        <View style={styles.container}>{children}</View>
      </>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    padding: 0,
    position: 'absolute',
    width: Layout.window.width,
    bottom: 0,
  },
  container: {
    margin: 0,
    padding: 0,
    marginVertical: 16,
  },
});
