import React, {useState} from 'react';

import {StyleSheet, TextInput, View} from 'react-native';

import {Button} from 'react-native-elements';

import Translations from '../../services/localization/Translations';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import System from '../../constants/System';

import SingleLineInputContainer from './SingleLineInputContainer';
import AntDesignIcon from '../Icons/AntDesignIcon';
import MultiLineInputContainer from './MultiLineInputContainer';
import LabelText from '../Text/LabelText';

export default function PasswordInput({label, value, onEdit, error, stack, onForgotPassword}) {
  const [isFocused, setFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [inputRef, setInputRef] = useState(null);

  const inputValue = value ? value : '';

  const focusInput = () => {
    if (inputRef) {
      inputRef.focus();
    }
  };

  const renderInput = () => {
    const inputComponent = (
      <View style={{...styles.container, ...(stack && styles.stackContainer)}}>
        <TextInput
          value={value}
          onChangeText={onEdit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...styles.input,
            ...(stack && styles.stackInput),
            ...(stack && styles.inputWithIcon),
          }}
          ref={setInputRef}
          autoCapitalize="none"
          secureTextEntry={!isPasswordVisible}
          textContentType="password"
        />
        {inputValue.length > 0 && (
          <Button
            icon={<AntDesignIcon name="eyeo" size={20} />}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            containerStyle={styles.showPasswordButtonContainer}
            buttonStyle={styles.showPasswordButton}
          />
        )}
      </View>
    );
    if (stack) {
      const forgotPwdLabel = (
        <View style={styles.forgotPasswordLabelContainer}>
          <LabelText text={Translations.PASSWORD} active={isFocused} />
          <Button
            onPress={onForgotPassword}
            title={`${Translations.FORGOT_PASSWORD}?`}
            buttonStyle={styles.forgotPasswordButton}
            titleStyle={styles.forgotPasswordButtonTitle}
          />
        </View>
      );
      return (
        <MultiLineInputContainer
          onPress={focusInput}
          label={onForgotPassword ? forgotPwdLabel : label}
          active={isFocused}
          error={error}>
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
  container: {
    flexDirection: 'row',
  },
  input: {
    color: Colors.black,
    fontFamily: Styles.fontRegular,
    fontSize: Styles.inputFontSize,
    paddingHorizontal: 0,
    paddingVertical: 0,
    textAlign: 'right',
  },
  inputWithIcon: {
    paddingVertical: 3,
  },
  stackContainer: {
    justifyContent: 'space-between',
  },
  stackInput: {
    textAlign: 'left',
  },
  showPasswordButtonContainer: {
    marginLeft: 6,
  },
  showPasswordButton: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  forgotPasswordLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: System.os === 'ios' ? 12 : 6,
  },
  forgotPasswordButton: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  forgotPasswordButtonTitle: {
    fontSize: Styles.secondaryFontSize,
    fontFamily: Styles.fontSemiBold,
    color: Colors.tintColor,
  },
});
