import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';
import Translations from '../../services/localization/Translations';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

export default function InputDoneButton({onPress}) {
  return (
    <View style={styles.container}>
      <Button
        title={Translations.DONE}
        onPress={onPress}
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    borderTopWidth: 1,
    borderTopColor: Colors.iosKeyboardBackground,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 6,
  },
  button: {
    backgroundColor: 'transparent',
  },
  buttonTitle: {
    color: Colors.tintColor,
    fontSize: Styles.primaryFontSize,
  },
});
