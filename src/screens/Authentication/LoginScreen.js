import React, {useEffect, useState} from 'react';

import {StyleSheet, Keyboard, View} from 'react-native';
import {Button} from 'react-native-elements';

import Translations from '../../services/localization/Translations';

import {useDispatch, useSelector} from 'react-redux';
import {fetchAccount} from '../../services/store/actions/authentication/fetchAccount';
import {login, loginResetState} from '../../services/store/actions/authentication/login';

import {dangerAnimation} from '../../constants/Animations';
import RequestStates from '../../constants/States/RequestStates';
import Colors from '../../constants/Colors';
import System from '../../constants/System';
import {ERROR_CODES} from '../../constants/Types/ErrorTypes';

import Logo from '../../assets/images/logo/laskux-logo-blue.svg';
import Layout from '../../constants/Layout';
import EmailInput from '../../components/Inputs/EmailInput';
import PasswordInput from '../../components/Inputs/PasswordInput';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import VerticalSafeAreaContainer from '../../components/Layout/VerticalSafeAreaContainer';

export default function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const loginState = useSelector((store) => store.login);

  const dangerToast = useSelector((store) => store.showToast.dangerToast);

  const [credentials, setCredentials] = useState({
    email: null,
    password: null,
  });

  useEffect(() => {
    if (loginState.state === RequestStates.SUCCESS) {
      if (loginState.accounts.length > 1) {
        navigation.navigate({
          name: 'SelectAccount',
          params: {
            accounts: loginState.accounts,
          },
        });
      } else {
        dispatch(fetchAccount());
      }
      dispatch(loginResetState());
    } else if (loginState.state === RequestStates.ERROR) {
      let errorMessage = Translations.LOGIN_FAILED;
      switch (loginState.error.code) {
        case ERROR_CODES.LOGIN_FAILED_DUE_INVALID_CREDENTIALS:
          errorMessage = Translations.LOGIN_FAILED_DUE_INVALID_CREDENTIALS;
          break;
        case ERROR_CODES.LOGIN_FAILED_DUE_INVALID_DATA:
          errorMessage = Translations.LOGIN_FAILED_DUE_INVALID_DATA;
          break;
        case ERROR_CODES.LOGIN_FAILED_DUE_UNVERIFIED_EMAIL:
          errorMessage = Translations.LOGIN_FAILED_DUE_UNVERIFIED_EMAIL;
          break;
        default:
          break;
      }
      return dangerToast.show(errorMessage, dangerAnimation);
    }
  }, [dispatch, loginState.accounts, loginState.state, loginState.error, navigation, dangerToast]);

  const emitChanges = (newData) => {
    setCredentials((data) => ({...data, ...newData}));
  };

  const dispatchLogin = () => {
    Keyboard.dismiss();
    dispatch(login(credentials));
  };

  return (
    <VerticalSafeAreaContainer style={styles.wrapper}>
      <KeyboardAwareScroll style={styles.container}>
        <View style={styles.formContainer}>
          <Logo width={Layout.window.width / (System.isTablet ? 2.5 : 1.75)} height="25%" />
          <View style={styles.form}>
            <EmailInput
              label={Translations.EMAIL}
              onEdit={(value) => emitChanges({email: value})}
              value={credentials.email}
              stack
            />
            <PasswordInput
              label={Translations.PASSWORD}
              onEdit={(value) => emitChanges({password: value})}
              value={credentials.password}
              onForgotPassword={() => navigation.navigate('ForgotPassword')}
              stack
            />
            <Button
              title={Translations.LOG_IN}
              onPress={dispatchLogin}
              containerStyle={styles.loginButtonContainer}
              loading={loginState.state === RequestStates.LOADING}
              buttonStyle={styles.loginButton}
            />
          </View>
        </View>
      </KeyboardAwareScroll>
    </VerticalSafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    flex: 1,
  },
  formContainer: {
    alignItems: 'center',
    width: Layout.window.width - 24,
    paddingHorizontal: 12,
    marginTop: 32,
    paddingBottom: 32,
  },
  form: {
    marginTop: 32,
    width: '100%',
  },
  loginButtonContainer: {
    width: '100%',
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  loginButton: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
