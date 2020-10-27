import React, {useEffect, useState} from 'react';

import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';
import {
  resetPassword,
  resetPasswordResetState,
} from '../../services/store/actions/authentication/resetPassword';
import {getFieldError} from '../../utilities/validations';
import {getMd5DateHash} from '../../utilities/date';

import Translations from '../../services/localization/Translations';
import Colors from '../../constants/Colors';
import RequestStates from '../../constants/States/RequestStates';

import PrimaryText from '../../components/Text/PrimaryText';
import EmailInput from '../../components/Inputs/EmailInput';
import TitleText from '../../components/Text/TitleText';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import Toast from '../../components/Toasts/Toast';

export default function ForgotPasswordScreen({navigation}) {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const resetPasswordState = useSelector((store) => store.resetPassword);
  const [email, setEmail] = useState(null);

  const dispatchResetPassword = () => {
    const data = {
      email: email,
      recaptcha: getMd5DateHash(),
    };
    dispatch(resetPassword(account.token, data));
  };

  const renderToast = () => {
    if (resetPasswordState.state === RequestStates.SUCCESS) {
      return <Toast type="success" message={Translations.RESET_PASSWORD_SUCCESS} />;
    }
  };

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(resetPasswordResetState());
    });
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScroll style={styles.scroll}>
        <View style={styles.description}>
          <TitleText text={`${Translations.FORGOT_PASSWORD}?`} />
          <PrimaryText text={Translations.FORGOT_PASSWORD_DESCRIPTION} />
        </View>
        {renderToast()}
        <View style={styles.formContainer}>
          <EmailInput
            label={Translations.EMAIL}
            value={email}
            onEdit={setEmail}
            error={getFieldError(resetPasswordState.error, 'email')}
            autoFocus
            stack
          />
          <Button
            onPress={dispatchResetPassword}
            title={Translations.RESET_PASSWORD}
            containerStyle={styles.sendButtonContainer}
            buttonStyle={styles.sendButton}
            loading={resetPasswordState.state === RequestStates.LOADING}
          />
        </View>
      </KeyboardAwareScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  scroll: {
    backgroundColor: Colors.white,
  },
  description: {
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
  },
  formContainer: {
    marginHorizontal: 12,
  },
  sendButtonContainer: {
    marginTop: 24,
  },
  sendButton: {
    paddingVertical: 12,
  },
});
