import React from 'react';

import {StyleSheet, TextInput} from 'react-native';

import Translations from '../../services/localization/Translations';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

export default function SearchInput({onEdit}) {
  return (
    <TextInput
      placeholder={Translations.SEARCH}
      placeholderTextColor={Colors.white}
      style={styles.input}
      onChangeText={onEdit}
      autoFocus={true}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    color: Colors.white,
    fontFamily: Styles.fontRegular,
    fontSize: Styles.titleSize,
    minWidth: '100%',
    minHeight: '100%',
  },
});
