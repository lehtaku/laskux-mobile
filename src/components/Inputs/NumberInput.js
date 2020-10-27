import React, {useCallback, useContext, useEffect, useState} from 'react';

import {StyleSheet, InputAccessoryView, Keyboard, TextInput, View} from 'react-native';

import {Badge} from 'react-native-elements';

import {LocalizationContext} from '../../services/localization/LocalizationContext';

import Styles from '../../constants/Styles';
import System from '../../constants/System';
import Colors from '../../constants/Colors';

import InputDoneButton from '../Buttons/InputDoneButton';
import SingleLineInputContainer from './SingleLineInputContainer';

export default function NumberInput({
  label,
  value,
  onEdit,
  error,
  autoFocus,
  badgeValue,
  maxLength,
  shrink,
  keyboardType,
  topBorder,
}) {
  const [isFocused, setFocused] = useState(false);
  const [input, setInput] = useState(null);

  const {numberFormatSettings} = useContext(LocalizationContext);

  const inputValue = value ? value : '';
  const inputAccessoryViewID = 'inputDoneButtonId';

  const focusInput = useCallback(() => {
    if (input) {
      if (System.os === 'android') {
        input.blur();
        setTimeout(() => {
          input.focus();
        }, 100);
      } else {
        input.focus();
      }
    }
  }, [input]);

  useEffect(() => {
    if (System.os === 'android' && autoFocus) {
      setTimeout(() => {
        focusInput();
      }, 50);
    }
  }, [focusInput, autoFocus]);

  const onChangeText = (text) => {
    if (text.length > 0) {
      let val = text;
      if (val.includes(',')) {
        val = val.replace(',', numberFormatSettings.decimalSeparator);
      }
      if (val.includes('.')) {
        val = val.replace('.', numberFormatSettings.decimalSeparator);
      }
      const decimalSeparatorIndex = val.indexOf(numberFormatSettings.decimalSeparator) + 1;
      if (decimalSeparatorIndex) {
        let decimalPart = val.slice(decimalSeparatorIndex);
        if (decimalPart.length > 2 || decimalPart.includes(',') || decimalPart.includes('.')) {
          return;
        }
      }
      return onEdit(val);
    } else {
      return onEdit(null);
    }
  };

  const getInputValue = () => {
    if (inputValue.startsWith(',') || inputValue.startsWith('.')) {
      return '0'.concat(inputValue);
    }
    return inputValue;
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SingleLineInputContainer
      label={label}
      active={isFocused}
      error={error}
      topBorder={topBorder}
      shrink={shrink}
      onPress={focusInput}>
      <View style={styles.container}>
        <TextInput
          value={getInputValue()}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCorrect={false}
          maxLength={maxLength}
          style={{
            ...styles.input,
            ...(!label && styles.inputWithoutLabel),
            ...(shrink && styles.inputSmall),
          }}
          inputAccessoryViewID={inputAccessoryViewID}
          ref={setInput}
          keyboardType={keyboardType ? keyboardType : 'decimal-pad'}
          autoCapitalize="none"
          autoFocus={autoFocus}
        />
        {badgeValue && (
          <Badge
            value={badgeValue}
            containerStyle={styles.badgeContainer}
            badgeStyle={styles.badge}
            textStyle={{
              ...styles.badgeText,
              ...(shrink && styles.badgeTextSmall),
              ...(isFocused && styles.activeText),
            }}
          />
        )}
        {System.os === 'ios' && (
          <InputAccessoryView
            nativeID={inputAccessoryViewID}
            children={<InputDoneButton onPress={hideKeyboard} />}
          />
        )}
      </View>
    </SingleLineInputContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  input: {
    color: Colors.black,
    flex: 1,
    fontFamily: Styles.fontRegular,
    fontSize: Styles.inputFontSize,
    paddingHorizontal: 0,
    paddingVertical: 0,
    textAlign: 'right',
  },
  inputSmall: {
    fontSize: Styles.secondaryFontSize,
    fontFamily: Styles.fontSemiBold,
    paddingVertical: 8,
  },
  inputWithoutLabel: {
    flex: 1,
    textAlign: 'left',
  },
  badgeContainer: {
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginLeft: 9,
  },
  badgeText: {
    color: Colors.black,
    fontFamily: Styles.fontSemiBold,
    fontSize: Styles.secondaryFontSize,
    paddingHorizontal: 0,
  },
  badgeTextSmall: {
    fontSize: Styles.secondaryFontSize,
  },
  active: {
    borderBottomColor: Colors.tintColor,
  },
  activeText: {
    color: Colors.tintColor,
  },
});
