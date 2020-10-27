import React, {useState} from 'react';

import {StyleSheet, TextInput} from 'react-native';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

import SingleLineInputContainer from './SingleLineInputContainer';
import MultiLineInputContainer from './MultiLineInputContainer';

export default function PlainTextInput({
  label,
  value,
  onEdit,
  error,
  maxLength,
  topBorder,
  disabled,
  shrink,
  stack,
  tooltip,
}) {
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...styles.input,
          ...(shrink && styles.inputSmall),
          ...(disabled && styles.disabled),
        }}
        value={value}
        onChangeText={onEdit}
        maxLength={maxLength}
        editable={!disabled}
        ref={setInputRef}
      />
    );
    if (stack) {
      return (
        <MultiLineInputContainer
          onPress={focusInput}
          label={label}
          active={isFocused}
          error={error}>
          {inputComponent}
        </MultiLineInputContainer>
      );
    }
    return (
      <SingleLineInputContainer
        label={label}
        active={isFocused}
        error={error}
        disabled={disabled}
        onPress={focusInput}
        topBorder={topBorder}
        tooltip={tooltip}
        shrink={shrink}>
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
  inputSmall: {
    fontSize: Styles.secondaryFontSize,
    paddingVertical: 8,
  },
  disabled: {
    color: Colors.lightBlack,
  },
});
