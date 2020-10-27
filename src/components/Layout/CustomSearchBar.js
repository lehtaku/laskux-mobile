import React from 'react';

import {StyleSheet, View} from 'react-native';

import {SearchBar} from 'react-native-elements';
import Translations from '../../services/localization/Translations';

import System from '../../constants/System';
import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import LabelError from '../Text/LabelError';

export default function CustomSearchBar({
  placeholder,
  value,
  onSearch,
  onSubmit,
  error,
  returnKeyType = 'search',
}) {
  return (
    <View style={styles.wrapper}>
      <SearchBar
        placeholder={placeholder}
        platform={System.os}
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        value={value}
        onChangeText={onSearch}
        cancelButtonProps={{buttonTextStyle: styles.cancelButtonText}}
        cancelButtonTitle={Translations.CLEAR}
        lightTheme
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmit}
      />
      {error && <LabelError text={error} style={styles.errorText} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
  },
  container: {
    backgroundColor: 'transparent',
    marginHorizontal: System.os === 'android' ? 8 : 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: Styles.borderRadiusMd,
  },
  input: {
    fontFamily: Styles.fontRegular,
    fontSize: Styles.inputFontSize,
  },
  cancelButtonText: {
    fontFamily: Styles.fontRegular,
  },
  errorText: {
    marginLeft: 12,
    marginTop: 4,
  },
});
