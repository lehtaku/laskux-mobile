import React from 'react';

import {StyleSheet} from 'react-native';
import Toast from 'react-native-easy-toast';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import {dangerAnimation, successAnimation} from '../../constants/Animations';

export default function FloatingToast({innerRef, type}) {
  const getFadeOutDuration = () => {
    switch (type) {
      case 'success':
        return successAnimation / 2;
      case 'danger':
        return dangerAnimation / 2;
      default:
        return 500;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'danger':
        return Colors.danger;
      case 'warning':
        return Colors.warning;
      case 'primary':
        return Colors.tintColor;
      default:
        return Colors.tintColor;
    }
  };

  return (
    <Toast
      ref={innerRef}
      style={{...styles.toast, backgroundColor: getBackgroundColor()}}
      position="bottom"
      textStyle={styles.text}
      fadeInDuration={0}
      fadeOutDuration={getFadeOutDuration()}
      opacity={type === 'success' ? 0.8 : 1}
    />
  );
}

const styles = StyleSheet.create({
  toast: {
    maxWidth: '95%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: Styles.borderRadiusLg,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  text: {
    color: Colors.white,
    fontFamily: Styles.fontBold,
    fontSize: Styles.primaryFontSize,
    textAlign: 'center',
  },
});
