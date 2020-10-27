import React, {useEffect} from 'react';

import {StyleSheet, View} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {
  setAccount,
  setAccountResetState,
} from '../../services/store/actions/authentication/setAccount';
import {fetchAccount} from '../../services/store/actions/authentication/fetchAccount';
import {fetchInvoicesResetState} from '../../services/store/actions/invoices/fetchInvoices';
import {fetchCustomersResetState} from '../../services/store/actions/customers/fetchCustomers';
import {fetchItemsResetState} from '../../services/store/actions/items/fetchItems';
import {fetchAccountDetailsResetState} from '../../services/store/actions/account/fetchAccountDetails';

import States from '../../constants/States/RequestStates';

import AccountSelectList from '../../components/Lists/AccountSelectList';

export default function ChangeAccountScreen({navigation, route}) {
  const dispatch = useDispatch();
  const accounts = route.params.accounts;
  const setAccountState = useSelector((store) => store.setAccount);

  useEffect(() => {
    if (setAccountState.state === States.SUCCESS) {
      dispatch(fetchAccountDetailsResetState());
      dispatch(fetchInvoicesResetState());
      dispatch(fetchCustomersResetState());
      dispatch(fetchItemsResetState());
      dispatch(setAccountResetState());
      dispatch(fetchAccount());
    }
  }, [navigation, dispatch, setAccountState.state]);

  const selectAccount = (account) => {
    dispatch(setAccount(account));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AccountSelectList accounts={accounts} onSelectAccount={selectAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
