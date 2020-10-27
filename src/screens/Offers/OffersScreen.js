import React, {useCallback, useEffect, useState} from 'react';

import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {deleteOffer, deleteOfferResetState} from '../../services/store/actions/offers/deleteOffer';
import {
  markAsApproved,
  markOfferAsApprovedResetState,
} from '../../services/store/actions/offers/markOfferAsApproved';
import {fetchOffers} from '../../services/store/actions/offers/fetchOffers';
import Translations from '../../services/localization/Translations';
import {viewOffer} from '../../services/store/actions/offers/viewOffer';

import System from '../../constants/System';
import RequestStates from '../../constants/States/RequestStates';
import Colors from '../../constants/Colors';
import OfferStates from '../../constants/States/OfferStates';
import {successAnimation} from '../../constants/Animations';

import ErrorNotification from '../../components/Notifications/ErrorNotification';
import Loading from '../../components/Indicators/Loading';
import ListingHeaderButtons from '../../components/Buttons/HeaderButtons/ListingHeaderButtons';
import SearchInput from '../../components/Inputs/SearchInput';
import HeaderRightCloseButton from '../../components/Buttons/HeaderButtons/HeaderRightCloseButton';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderMenuButton from '../../components/Buttons/HeaderButtons/HeaderMenuButton';
import OffersList from '../../components/Lists/OffersList';
import PDFModalViewer from '../../components/Modals/PDFModalViewer';
import {sendOffer, sendOfferResetState} from '../../services/store/actions/offers/sendOffer';
import EntypoIcon from '../../components/Icons/EntypoIcon';
import FeatherIcon from '../../components/Icons/FeatherIcon';

export default function OffersScreen({navigation}) {
  const parentNavigator = navigation.dangerouslyGetParent();

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const fetchOffersState = useSelector((store) => store.fetchOffers);
  const createOfferState = useSelector((store) => store.createOffer);
  const editOfferState = useSelector((store) => store.editOffer);
  const markAsApprovedState = useSelector((store) => store.markOfferAsApproved);
  const deleteOfferState = useSelector((store) => store.deleteOffer);
  const viewOfferState = useSelector((store) => store.viewOffer);
  const sendOfferState = useSelector((store) => store.sendOffer);

  const successToast = useSelector((store) => store.showToast.successToast);

  const {showActionSheetWithOptions} = useActionSheet();

  const [isViewOfferVisible, setIsViewOfferVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(null);

  const loadData = useCallback(
    (isRefreshing) => {
      dispatch(fetchOffers(account.token, isRefreshing));
    },
    [account.token, dispatch],
  );

  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const createOffer = useCallback(() => {
    navigation.navigate('CreateOffer');
  }, [navigation]);

  const setNavParams = useCallback(() => {
    if (parentNavigator) {
      parentNavigator.setOptions({
        headerLeft: () => <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />,
        headerTitle: Translations.OFFERS,
        headerRight: () => <ListingHeaderButtons onCreate={createOffer} onSearch={openSearch} />,
      });
    }
  }, [parentNavigator, navigation, createOffer, openSearch]);

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
  }, [loadData]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setNavParams();
    });
  }, [navigation, setNavParams]);

  useEffect(() => {
    if (createOfferState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [createOfferState.state, refresh]);

  useEffect(() => {
    if (editOfferState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [editOfferState.state, refresh]);

  useEffect(() => {
    if (markAsApprovedState.state === RequestStates.SUCCESS) {
      dispatch(markOfferAsApprovedResetState());
      refresh();
    }
  }, [dispatch, markAsApprovedState.state, refresh]);

  useEffect(() => {
    if (deleteOfferState.state === RequestStates.SUCCESS) {
      dispatch(deleteOfferResetState());
      refresh();
      return successToast.show(Translations.DELETE_OFFER_SUCCESS, successAnimation);
    }
  }, [deleteOfferState.state, dispatch, refresh, successToast]);

  useEffect(() => {
    if (sendOfferState.state === RequestStates.SEND_SUCCESS) {
      dispatch(sendOfferResetState());
      refresh();
      return successToast.show(Translations.EMAIL_SENT_SUCCESS);
    }
  }, [dispatch, refresh, sendOfferState.state, successToast]);

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

  const onSend = (data) => {
    dispatch(sendOffer(data.id, account.token, data));
  };

  const getOfferTitle = ({customer, offer_number}) => {
    let title = customer.name;
    if (offer_number) {
      title = `${offer_number} | `.concat(customer.name);
    }
    return title;
  };

  const getAvailableOptions = ({state}) => {
    let options = {
      values: [],
      icons: [],
    };
    switch (state) {
      case OfferStates.DRAFT:
        options.icons.push(
          <EntypoIcon name="edit" />,
          <FeatherIcon name="send" />,
          <AntDesignIcon name="check" />,
        );
        options.values.push(Translations.EDIT, Translations.SEND, Translations.MARK_AS_APPROVED);
        break;
      case OfferStates.SENT:
        options.icons.push(<AntDesignIcon name="check" />);
        options.values.push(Translations.MARK_AS_APPROVED);
    }
    return {
      values: [Translations.VIEW].concat(options.values, Translations.DELETE, Translations.CANCEL),
      icons: [<AntDesignIcon name="eyeo" />].concat(
        options.icons,
        <AntDesignIcon name="delete" />,
        <MaterialIcon name="cancel" />,
      ),
    };
  };

  const showOptions = (offer) => {
    const title = getOfferTitle(offer);
    const options = getAvailableOptions(offer);

    const destructiveButtonIndex = options.values.indexOf(Translations.DELETE);
    const cancelButtonIndex = options.values.indexOf(Translations.CANCEL);

    showActionSheetWithOptions(
      {
        title,
        options: options.values,
        cancelButtonIndex,
        destructiveButtonIndex,
        tintColor: Colors.tintColor,
        icons: options.icons,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case options.values.indexOf(Translations.VIEW):
            setIsViewOfferVisible(true);
            return dispatch(viewOffer(offer.id, account.token));
          case options.values.indexOf(Translations.EDIT):
            return navigation.navigate('EditOffer', {offer});
          case options.values.indexOf(Translations.SEND):
            return navigation.navigate('SendOffer', {
              offer,
              onSendOffer: onSend,
            });
          case options.values.indexOf(Translations.MARK_AS_APPROVED):
            return onMarkAsApproved(offer);
          case options.values.indexOf(Translations.DELETE):
            return onDelete(offer);
          default:
            return;
        }
      },
    );
  };

  const onMarkAsApproved = ({id}) => {
    Alert.alert(Translations.MARK_AS_APPROVED, `${Translations.MARK_AS_APPROVED_CONFIRM}?`, [
      {
        text: Translations.CANCEL,
        cancelable: true,
        style: 'cancel',
      },
      {
        text: Translations.OK,
        onPress: () => dispatch(markAsApproved(id, account.token)),
        style: 'destructive',
      },
    ]);
  };

  const onDelete = ({id}) => {
    Alert.alert(Translations.DELETE_OFFER, `${Translations.DELETE_OFFER_CONFIRM}?`, [
      {
        text: Translations.CANCEL,
        cancelable: true,
        style: 'cancel',
      },
      {
        text: Translations.OK,
        onPress: () => dispatch(deleteOffer(id, account.token)),
        style: 'destructive',
      },
    ]);
  };

  const isLoading = () => {
    return (
      deleteOfferState.state === RequestStates.LOADING ||
      markAsApprovedState.state === RequestStates.LOADING
    );
  };

  const renderContent = () => {
    switch (fetchOffersState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_OFFERS} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_OFFERS_FAILED}
            onPressButton={() => loadData()}
          />
        );
      case RequestStates.REFRESHING:
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <OffersList
              offers={fetchOffersState.offers}
              onPressOffer={showOptions}
              onRefresh={refresh}
              isRefreshing={fetchOffersState.state === RequestStates.REFRESHING}
              searchKeyword={searchKeyword}
              onCreate={createOffer}
            />
            <PDFModalViewer
              isVisible={isViewOfferVisible}
              isLoading={viewOfferState.state === RequestStates.LOADING}
              source={{
                uri: 'data:application/pdf;base64,' + viewOfferState.pdfData,
              }}
              loadingText={Translations.LOADING_OFFER}
              onClose={() => setIsViewOfferVisible(false)}
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
