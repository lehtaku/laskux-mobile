import React, {useState, useEffect, useCallback, useContext} from 'react';

import {StyleSheet, View} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {fetchAccountDetails} from '../../services/store/actions/account/fetchAccountDetails';
import Translations from '../../services/localization/Translations';
import {editOffer, editOfferResetState} from '../../services/store/actions/offers/editOffer';
import {parseDecimalToLocale} from '../../utilities/currencies';
import {parseDecimalToString} from '../../utilities/calculation';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {getParsedOffer} from '../../utilities/parsers';
import {fetchOffer} from '../../services/store/actions/offers/fetchOffer';

import {OFFER_FORM_INITIAL} from '../../constants/States/FormStates';
import {FORM_TYPES} from '../../constants/Types/FormTypes';
import RequestStates from '../../constants/States/RequestStates';
import {successAnimation} from '../../constants/Animations';

import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';
import OfferForm from '../../components/Forms/OfferForm';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';

export default function EditOfferScreen({navigation, route}) {
  const dispatch = useDispatch();
  const offer = route.params?.offer;

  const account = useSelector((store) => store.fetchAccount);
  const editOfferState = useSelector((store) => store.editOffer);
  const fetchOfferState = useSelector((store) => store.fetchOffer);

  const {locale, currency} = useContext(LocalizationContext);
  const successToast = useSelector((store) => store.showToast.successToast);

  const [offerFormData, setOfferFormData] = useState(OFFER_FORM_INITIAL);

  const loadData = useCallback(() => {
    dispatch(fetchAccountDetails(account.token));
    dispatch(fetchOffer(offer.id, account.token));
  }, [dispatch, account.token, offer.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (fetchOfferState.state === RequestStates.SUCCESS) {
      const {
        customer,
        offer_date,
        valid_to,
        details,
        message,
        author,
        items,
        discount_rows,
      } = fetchOfferState.offer;
      setOfferFormData((data) => ({
        ...data,
        customer,
        offer_date,
        valid_to,
        details,
        message,
        author,
        items: items.map((item) => {
          let itemData = {
            date: item.date,
            name: item.name,
            price: item.price,
            price_with_vat: item.price_with_vat,
            quantity: parseDecimalToLocale(locale.languageTag, currency, item.quantity),
            unit: item.unit,
            vat_method: item.vat_method,
            vat_percent: item.vat_percent,
            vat_price: item.vat_price,
          };
          if (item.hasOwnProperty('item_id')) {
            itemData = {...itemData, id: item.item_id};
          }
          return itemData;
        }),
        discount_rows: discount_rows.map((item) => {
          return {
            name: item.name,
            price: parseDecimalToLocale(locale.languageTag, currency, -1 * parseFloat(item.price)),
            price_with_vat: parseDecimalToLocale(
              locale.languageTag,
              currency,
              -1 * parseFloat(item.price_with_vat),
            ),
            quantity: item.quantity,
            vat_method: item.vat_method,
            vat_percent: item.vat_percent.toString(),
            vat_price: parseDecimalToString(-1 * parseFloat(item.vat_price)),
          };
        }),
      }));
    }
  }, [currency, fetchOfferState.offer, fetchOfferState.state, locale.languageTag, offer]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  useEffect(() => {
    if (editOfferState.state === RequestStates.SUCCESS) {
      successToast.show(Translations.EDIT_OFFER_SUCCESS, successAnimation);
      dispatch(editOfferResetState());
      return navigation.navigate({name: 'Offers'});
    }
  }, [editOfferState.state, dispatch, successToast, navigation]);

  const dispatchEditOffer = () => {
    const data = {
      ...getParsedOffer(offerFormData),
    };
    dispatch(editOffer(offer.id, account.token, data));
  };

  const onLeave = () => {
    dispatch(editOfferResetState());
    navigation.goBack();
  };

  const isLoading = () => {
    return editOfferState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    switch (fetchOfferState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_OFFER} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification message={Translations.LOADING_OFFER_FAILED} onPressButton={loadData} />
        );
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <OfferForm
              formData={offerFormData}
              onChange={setOfferFormData}
              state={editOfferState.state}
              error={editOfferState.error}
              onSave={dispatchEditOffer}
              onLeave={onLeave}
              formType={FORM_TYPES.EDIT}
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
