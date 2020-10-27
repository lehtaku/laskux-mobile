import React from 'react';
import {StyleSheet} from 'react-native';
import {ButtonGroup} from 'react-native-elements';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import System from '../../constants/System';

export default function CustomButtonGroup({value, buttons, onChange, textStyle}) {
  return (
    <ButtonGroup
      buttons={buttons}
      selectedIndex={value}
      containerStyle={styles.buttonGroupContainer}
      selectedButtonStyle={styles.selectedButton}
      buttonStyle={styles.button}
      innerBorderStyle={styles.buttonInnerBorder}
      onPress={onChange}
      textStyle={{...textStyle}}
    />
  );
}

const styles = StyleSheet.create({
  buttonGroupContainer: {
    marginVertical: 12,
    marginHorizontal: 12,
    borderRadius: Styles.borderRadiusMd,
    borderColor: Colors.tintColor,
    backgroundColor: System.os === 'android' ? Colors.tintColor : Colors.white,
  },
  button: {
    backgroundColor: Colors.white,
  },
  selectedButton: {
    backgroundColor: Colors.tintColor,
  },
  buttonInnerBorder: {
    width: 0,
  },
});
