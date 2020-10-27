import React, {useState} from 'react';

import {StyleSheet, TextInput} from 'react-native';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

import SingleLineInputContainer from './SingleLineInputContainer';
import MultiLineInputContainer from './MultiLineInputContainer';

export default function EmailInput({label, value, onEdit, error, maxLength, stack, autoFocus}) {
  const [isFocused, setFocused] = useState(false);
  const [inputRef, setInputRef] = useState(null);

  const focusInput = () => {
    if (inputRef) {
      inputRef.focus();
    }
  };

  const renderInput = () => {
    const inputComponent = (
      <TextInput
        autoFocus={autoFocus}
        value={value}
        onChangeText={onEdit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
        ref={setInputRef}
        maxLength={maxLength}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
      />
    );
    if (stack) {
      return (
        <MultiLineInputContainer
          label={label}
          active={isFocused}
          error={error}
          onPress={focusInput}>
          {inputComponent}
        </MultiLineInputContainer>
      );
    }
    return (
      <SingleLineInputContainer label={label} error={error} active={isFocused} onPress={focusInput}>
        {inputComponent}
      </SingleLineInputContainer>
    );
  };

  return renderInput();
}

const styles = StyleSheet.create({
  input: {
    color: Colors.black,
    fontFamily: Styles.fontRegular,
    fontSize: Styles.inputFontSize,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
