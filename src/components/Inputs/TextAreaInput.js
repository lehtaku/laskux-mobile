import React, {useState} from 'react';

import {StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, View} from 'react-native';
import Translations from '../../services/localization/Translations';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

import LabelText from '../Text/LabelText';
import LabelError from '../Text/LabelError';
import System from '../../constants/System';

export default function TextAreaInput({
  label,
  value,
  onEdit,
  error,
  maxLength,
  autoFocus,
  onSubmitEditing,
}) {
  const [isFocused, setFocused] = useState(false);
  const [input, setInput] = useState(null);

  const focusInput = () => {
    if (input) {
      input.focus();
    }
  };

  const renderInput = () => {
    return (
      <View style={styles.container}>
        <LabelText text={label} active={isFocused} />
        {error && <LabelError text={error} style={styles.errorLabel} />}
        <TextInput
          style={styles.input}
          onChangeText={onEdit}
          value={value}
          multiline={true}
          autoFocus={autoFocus}
          maxLength={maxLength}
          placeholder={`${Translations.WRITE_HERE}...`}
          ref={setInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    );
  };

  return System.os === 'ios' ? (
    <TouchableOpacity onPress={focusInput}>{renderInput()}</TouchableOpacity>
  ) : (
    <TouchableNativeFeedback onPress={focusInput}>{renderInput()}</TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 90,
  },
  input: {
    color: Colors.black,
    width: '100%',
    fontFamily: Styles.fontRegular,
    fontSize: Styles.inputFontSize,
    paddingHorizontal: 0,
    paddingTop: 20,
    paddingBottom: 12,
  },
  errorLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  active: {
    borderBottomColor: Colors.tintColor,
  },
});
