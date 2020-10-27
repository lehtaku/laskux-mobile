import React from 'react';

import {Keyboard, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../constants/Colors';

export default function KeyboardAwareScroll({children, innerRef, style, extraScrollHeight}) {
  const defaultExtraScrollHeight = extraScrollHeight ? extraScrollHeight : 24;

  return (
    <KeyboardAwareScrollView
      onScrollBeginDrag={() => Keyboard.dismiss()}
      extraScrollHeight={defaultExtraScrollHeight}
      ref={innerRef}
      contentContainerStyle={{...styles.scrollContainer, ...style}}
      enableResetScrollToCoords={false}
      showsVerticalScrollIndicator={false}
      children={children}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: Colors.screenBackground,
    paddingBottom: 64,
  },
});
