import React, {useCallback, useEffect, useState} from 'react';

import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useActionSheet} from '@expo/react-native-action-sheet';

import {useDispatch, useSelector} from 'react-redux';
import {fetchReceipts} from '../../services/store/actions/receipts/fetchReceipts';
import {
  deleteReceipt,
  deleteReceiptResetState,
} from '../../services/store/actions/receipts/deleteReceipt';
import Translations from '../../services/localization/Translations';

import RequestStates from '../../constants/States/RequestStates';
import System from '../../constants/System';
import Colors from '../../constants/Colors';
import {successAnimation} from '../../constants/Animations';

import ListingHeaderButtons from '../../components/Buttons/HeaderButtons/ListingHeaderButtons';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import ReceiptsList from '../../components/Lists/ReceiptsList';
import SearchInput from '../../components/Inputs/SearchInput';
import HeaderRightCloseButton from '../../components/Buttons/HeaderButtons/HeaderRightCloseButton';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import EntypoIcon from '../../components/Icons/EntypoIcon';
import InvoiceStates from '../../constants/States/InvoiceStates';
import HeaderMenuButton from '../../components/Buttons/HeaderButtons/HeaderMenuButton';

export default function ReceiptsScreen({navigation}) {
  const parentNavigator = navigation.dangerouslyGetParent();
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const fetchReceiptsState = useSelector((store) => store.fetchReceipts);
  const completeReceiptState = useSelector((store) => store.completeReceipt);
  const editReceiptState = useSelector((store) => store.editReceipt);
  const deleteReceiptState = useSelector((store) => store.deleteReceipt);

  const successToast = useSelector((store) => store.showToast.successToast);

  const {showActionSheetWithOptions} = useActionSheet();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(null);

  const loadData = useCallback(
    (isRefreshing) => {
      dispatch(fetchReceipts(account.token, isRefreshing));
    },
    [account.token, dispatch],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const createReceipt = useCallback(() => {
    navigation.navigate('CreateReceipt');
  }, [navigation]);

  const setNavParams = useCallback(() => {
    if (parentNavigator) {
      parentNavigator.setOptions({
        headerLeft: () => <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />,
        headerTitle: Translations.RECEIPTS,
        headerRight: () => <ListingHeaderButtons onCreate={createReceipt} onSearch={openSearch} />,
      });
    }
  }, [createReceipt, navigation, openSearch, parentNavigator]);

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
    setNavParams();
  }, [setNavParams]);

  useEffect(() => {
    if (completeReceiptState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [completeReceiptState.state, refresh]);

  useEffect(() => {
    if (editReceiptState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [editReceiptState.state, refresh]);

  useEffect(() => {
    if (deleteReceiptState.state === RequestStates.SUCCESS) {
      dispatch(deleteReceiptResetState());
      refresh();
      return successToast.show(Translations.DELETE_RECEIPT_SUCCESS, successAnimation);
    }
  }, [deleteReceiptState.state, dispatch, refresh, successToast]);

  const showOptions = (receipt) => {
    const {state, description} = receipt;

    const options = [Translations.VIEW];
    const icons = [<AntDesignIcon name="eyeo" />];
    if (state === InvoiceStates.DRAFT || state === InvoiceStates.OPEN) {
      options.push(Translations.EDIT);
      icons.push(<EntypoIcon name="edit" />);
    }
    options.push(Translations.DELETE, Translations.CANCEL);
    icons.push(<AntDesignIcon name="delete" />, <MaterialIcon name="cancel" />);

    const destructiveButtonIndex = options.indexOf(Translations.DELETE);
    const cancelButtonIndex = options.indexOf(Translations.CANCEL);

    showActionSheetWithOptions(
      {
        description,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        tintColor: Colors.tintColor,
        icons,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case options.indexOf(Translations.VIEW):
            return navigation.navigate('ViewReceipt', {receipt});
          case options.indexOf(Translations.EDIT):
            return navigation.navigate('EditReceipt', {receipt});
          case options.indexOf(Translations.DELETE):
            return onDelete(receipt);
          default:
            return;
        }
      },
    );
  };

  const onDelete = (receipt) => {
    Alert.alert(Translations.DELETE_RECEIPT, `${Translations.DELETE_RECEIPT_CONFIRM}?`, [
      {
        text: Translations.CANCEL,
        cancelable: true,
        style: 'cancel',
      },
      {
        text: Translations.OK,
        onPress: () => dispatch(deleteReceipt(receipt.id, account.token)),
        style: 'destructive',
      },
    ]);
  };

  const isLoading = () => {
    return deleteReceiptState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    switch (fetchReceiptsState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_RECEIPTS} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_RECEIPTS_FAILED}
            onPressButton={() => loadData()}
          />
        );
      case RequestStates.REFRESHING:
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <ReceiptsList
              receipts={fetchReceiptsState.receipts}
              searchKeyword={searchKeyword}
              onRefresh={refresh}
              isRefreshing={fetchReceiptsState.state === RequestStates.REFRESHING}
              onPressReceipt={showOptions}
              onAddReceipt={createReceipt}
            />
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
