import React, {useCallback, useContext, useEffect} from 'react';

import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import {useDispatch, useSelector} from 'react-redux';
import {fetchAppVersion} from '../services/store/actions/tools/fetchAppVersion';
import {fetchAccount} from '../services/store/actions/authentication/fetchAccount';
import {logoutResetState} from '../services/store/actions/authentication/logout';
import {setDangerToast, setSuccessToast} from '../services/store/actions/toasts/showToast';

import {LocalizationContext} from '../services/localization/LocalizationContext';

import RequestStates from '../constants/States/RequestStates';
import System from '../constants/System';

import AuthenticationNavigator from './AuthenticationNavigator';
import AppContainer from '../AppContainer';
import FloatingToast from '../components/Toasts/FloatingToast';
import UpdateApplicationScreen from '../screens/Service/UpdateApplicationScreen';
import LaunchingLoader from '../components/Indicators/LaunchingLoader';

export default function AppNavigator() {
  const dispatch = useDispatch();
  const fetchAppVersionState = useSelector((store) => store.fetchAppVersion);
  const account = useSelector((store) => store.fetchAccount);
  const logoutState = useSelector((store) => store.logout);

  const {initializeLocalization} = useContext(LocalizationContext);

  const loadAccount = useCallback(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  const loadAppVersion = useCallback(() => {
    dispatch(fetchAppVersion());
  }, [dispatch]);

  useEffect(() => {
    loadAccount();
    loadAppVersion();
  }, [loadAccount, loadAppVersion]);

  useEffect(() => {
    initializeLocalization();
  }, [initializeLocalization]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (logoutState.state === RequestStates.SUCCESS) {
      loadAccount();
      dispatch(logoutResetState());
    }
  }, [loadAccount, logoutState.state, dispatch]);

  const renderNavigator = () => {
    if (fetchAppVersionState[System.os].latest_version > System.appVersion) {
      return <UpdateApplicationScreen />;
    }
    switch (account.state) {
      case RequestStates.SUCCESS:
        return <AppContainer />;
      case RequestStates.ERROR:
        return <AuthenticationNavigator initialRouteName="Login" />;
      default:
        return <LaunchingLoader />;
    }
  };

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {renderNavigator()}
        <FloatingToast innerRef={(ref) => dispatch(setSuccessToast(ref))} type="success" />
        <FloatingToast innerRef={(ref) => dispatch(setDangerToast(ref))} type="danger" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
