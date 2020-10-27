import React, {useCallback, useEffect, useState} from 'react';

import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {fetchCustomers} from '../../services/store/actions/customers/fetchCustomers';
import {
  filterCustomersResetState,
  filterCustomersSetCategory,
} from '../../services/store/actions/customers/filterCustomers';
import {fetchGroups} from '../../services/store/actions/customers/fetchGroups';
import {
  deleteCustomer,
  deleteCustomerResetState,
} from '../../services/store/actions/customers/deleteCustomer';
import {setInvoicesState} from '../../services/store/actions/invoices/invoiceActions';
import Translations from '../../services/localization/Translations';

import System from '../../constants/System';
import {INVOICE_DIRECTIONS} from '../../constants/Types/InvoiceTypes';
import RequestStates from '../../constants/States/RequestStates';
import Colors from '../../constants/Colors';
import {successAnimation} from '../../constants/Animations';

import CustomersList from '../../components/Lists/CustomersList';
import FilteringButton from '../../components/Buttons/FilteringButton';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import Loading from '../../components/Indicators/Loading';
import ListingHeaderButtons from '../../components/Buttons/HeaderButtons/ListingHeaderButtons';
import SearchInput from '../../components/Inputs/SearchInput';
import HeaderRightCloseButton from '../../components/Buttons/HeaderButtons/HeaderRightCloseButton';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderMenuButton from '../../components/Buttons/HeaderButtons/HeaderMenuButton';

export default function CustomersScreen({navigation}) {
  const parentNavigator = navigation.dangerouslyGetParent();

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const customers = useSelector((store) => store.fetchCustomers);
  const fetchInvoicesState = useSelector((store) => store.fetchInvoices);
  const filterCustomers = useSelector((store) => store.filterCustomers);
  const fetchGroupsState = useSelector((store) => store.fetchGroups);
  const createCustomerState = useSelector((store) => store.createCustomer);
  const editCustomerState = useSelector((store) => store.editCustomer);
  const deleteCustomerState = useSelector((store) => store.deleteCustomer);
  const invoiceActionsState = useSelector((store) => store.invoiceActions);

  const successToast = useSelector((store) => store.showToast.successToast);

  const {showActionSheetWithOptions} = useActionSheet();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(null);

  const isFilteringOn = useCallback(() => {
    return filterCustomers.group !== 'all';
  }, [filterCustomers.group]);

  const loadData = useCallback(
    (isRefreshing) => {
      let path = '/customers';
      if (isFilteringOn()) {
        path = `/groups/${filterCustomers.group}/customers`;
      }
      dispatch(fetchCustomers(path, account.token, isRefreshing));
      dispatch(fetchGroups(account.token));
    },
    [account.token, dispatch, filterCustomers.group, isFilteringOn],
  );

  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const createCustomer = useCallback(() => {
    navigation.navigate('CreateCustomer');
  }, [navigation]);

  const setNavParams = useCallback(() => {
    if (parentNavigator) {
      parentNavigator.setOptions({
        headerLeft: () => <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />,
        headerTitle: Translations.CUSTOMERS,
        headerRight: () => <ListingHeaderButtons onCreate={createCustomer} onSearch={openSearch} />,
      });
    }
  }, [parentNavigator, navigation, createCustomer, openSearch]);

  const openSearch = useCallback(() => {
    if (parentNavigator) {
      setIsSearchVisible(true);
      parentNavigator.setOptions({
        headerLeft: null,
        headerTitle: () => <SearchInput onEdit={setSearchKeyword} />,
        headerRight: () => <HeaderRightCloseButton onPress={resetSearch} />,
      });
    }
  }, [parentNavigator, resetSearch]);

  const resetSearch = useCallback(() => {
    setSearchKeyword(null);
    setIsSearchVisible(false);
    setNavParams();
  }, [setNavParams]);

  const backButtonHandler = useCallback(() => {
    if (isSearchVisible) {
      resetSearch();
      return true;
    } else {
      return false;
    }
  }, [isSearchVisible, resetSearch]);

  useFocusEffect(() => {
    if (System.os === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }
  }, [backButtonHandler]);

  useEffect(() => {
    loadData();
  }, [loadData, filterCustomers.group]);

  useEffect(() => {
    if (createCustomerState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [createCustomerState.state, refresh]);

  useEffect(() => {
    if (editCustomerState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [editCustomerState.state, refresh]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setNavParams();
    });
  }, [navigation, setNavParams]);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      if (parentNavigator) {
        parentNavigator.setOptions({
          headerTitle: null,
          headerRight: null,
        });
      }
    });
  }, [parentNavigator, navigation]);

  useEffect(() => {
    if (deleteCustomerState.state === RequestStates.SUCCESS) {
      dispatch(deleteCustomerResetState());
      refresh();
      return successToast.show(Translations.DELETE_CUSTOMER_SUCCESS, successAnimation);
    }
  }, [deleteCustomerState.state, dispatch, refresh, successToast]);

  const shouldRenderFiltering = () => {
    if (isFilteringOn()) {
      return true;
    }
    return fetchGroupsState.groups.length > 0;
  };

  const showOptions = (customer) => {
    const title = customer.name;
    const viewOrEdit = `${Translations.VIEW} / ${Translations.EDIT}`;
    const options = [viewOrEdit, Translations.DO_INVOICE];
    const icons = [<AntDesignIcon name="eyeo" />, <MaterialIcon name="attach-money" />];
    const hasInvoices = fetchInvoicesState.invoices.all.some(
      (invoice) => invoice.customer.id === customer.id,
    );
    if (hasInvoices) {
      options.push(Translations.SHOW_INVOICES);
      icons.push(<AntDesignIcon name="file1" />);
    }
    options.push(Translations.DELETE, Translations.CANCEL);
    icons.push(<AntDesignIcon name="delete" />, <MaterialIcon name="cancel" />);

    const destructiveButtonIndex = options.indexOf(Translations.DELETE);
    const cancelButtonIndex = options.indexOf(Translations.CANCEL);

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        tintColor: Colors.tintColor,
        icons,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case options.indexOf(Translations.DO_INVOICE):
            return navigation.navigate('CreateInvoice', {customer});
          case options.indexOf(viewOrEdit):
            return navigation.navigate('EditCustomer', {customer});
          case options.indexOf(Translations.SHOW_INVOICES):
            dispatch(
              setInvoicesState({
                ...invoiceActionsState,
                invoicesDirection: INVOICE_DIRECTIONS.OUTGOING,
                customer: {
                  id: customer.id,
                  name: customer.name,
                },
              }),
            );
            return navigation.navigate('Invoices');
          case options.indexOf(Translations.DELETE):
            return onDelete(customer);
          default:
            return;
        }
      },
    );
  };

  const onDelete = (customer) => {
    Alert.alert(Translations.DELETE_CUSTOMER, `${Translations.DELETE_CUSTOMER_CONFIRM}?`, [
      {
        text: Translations.CANCEL,
        cancelable: true,
        style: 'cancel',
      },
      {
        text: Translations.OK,
        onPress: () => dispatch(deleteCustomer(customer.id, account.token)),
        style: 'destructive',
      },
    ]);
  };

  const getGroupSelectorData = () => {
    const selectorItems = fetchGroupsState.groups.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    selectorItems.unshift({
      label: Translations.SHOW_ALL,
      value: 'all',
    });
    return selectorItems;
  };

  const showFiltering = () => {
    navigation.navigate('SelectorScreen', {
      title: Translations.CUSTOMER_GROUP,
      value: filterCustomers.group,
      onSelect: (group) => dispatch(filterCustomersSetCategory(group.value)),
      data: getGroupSelectorData(),
    });
  };

  const isLoading = () => {
    return deleteCustomerState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    switch (customers.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_CUSTOMERS} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_CUSTOMERS_FAILED}
            onPressButton={() => loadData()}
          />
        );
      case RequestStates.REFRESHING:
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <CustomersList
              customers={customers.customers}
              onPressCustomer={showOptions}
              onRefresh={refresh}
              isRefreshing={customers.state === RequestStates.REFRESHING}
              searchKeyword={searchKeyword}
              onCreate={createCustomer}
              isFiltering={isFilteringOn()}
            />
            {shouldRenderFiltering() && (
              <>
                <FilteringButton
                  onPress={showFiltering}
                  isFiltering={isFilteringOn()}
                  onClear={() => dispatch(filterCustomersResetState())}
                />
              </>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
