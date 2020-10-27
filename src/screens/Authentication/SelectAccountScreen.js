import React, {useEffect} from 'react';

import {StyleSheet, View} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import {useSelector, useDispatch} from 'react-redux';
import {
  setAccount,
  setAccountResetState,
} from '../../services/store/actions/authentication/setAccount';
import {fetchAccount} from '../../services/store/actions/authentication/fetchAccount';
import Translations from '../../services/localization/Translations';

import States from '../../constants/States/RequestStates';
import System from '../../constants/System';
import Layout from '../../constants/Layout';

import Logo from '../../assets/images/logo/laskux-logo-blue.svg';
import AccountSelectList from '../../components/Lists/AccountSelectList';
import CustomDivider from '../../components/Layout/CustomDivider';
import TitleText from '../../components/Text/TitleText';

export default function SelectAccountScreen({route}) {
  const dispatch = useDispatch();
  const accounts = route.params.accounts;
  const setAccountState = useSelector((store) => store.setAccount.state);

  useEffect(() => {
    if (setAccountState === States.SUCCESS) {
      dispatch(setAccountResetState());
      dispatch(fetchAccount());
    }
  }, [dispatch, setAccountState]);

  return (
    <SafeAreaView style={styles.wrapper} forceInset={{vertical: 'always'}}>
      <View style={styles.container}>
        <Logo width={Layout.window.width / (System.isTablet ? 2.5 : 1.75)} height="30%" />
        <View style={styles.selectorContainer}>
          <TitleText text={Translations.SELECT_ACCOUNT} style={styles.title} />
          <CustomDivider marginTop={16} />
          <AccountSelectList
            accounts={accounts}
            onSelectAccount={(account) => dispatch(setAccount(account))}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingVertical: 32,
  },
  container: {
    alignItems: 'center',
  },
  selectorContainer: {
    marginVertical: 32,
    width: '100%',
  },
  title: {
    textAlign: 'center',
  },
});
