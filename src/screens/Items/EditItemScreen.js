import React, {useCallback, useContext, useEffect, useState} from 'react';

import {LocalizationContext} from '../../services/localization/LocalizationContext';
import Translations from '../../services/localization/Translations';

import {useDispatch, useSelector} from 'react-redux';
import {editItem, editItemResetState} from '../../services/store/actions/items/editItem';
import {fetchItem} from '../../services/store/actions/items/fetchItem';

import {parseDecimalToLocale} from '../../utilities/currencies';
import {getParsedItem} from '../../utilities/parsers';

import RequestStates from '../../constants/States/RequestStates';
import {ITEM_FORM_INITIAL} from '../../constants/States/FormStates';
import {successAnimation} from '../../constants/Animations';

import ItemForm from '../../components/Forms/ItemForm';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';

export default function EditItemScreen({navigation, route}) {
  const item = route.params?.item;
  const onItemEdited = route.params?.onItemEdited;

  const {locale, currency} = useContext(LocalizationContext);

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const editItemState = useSelector((store) => store.editItem);
  const fetchItemState = useSelector((store) => store.fetchItem);

  const successToast = useSelector((store) => store.showToast.successToast);

  const [formData, setFormData] = useState(ITEM_FORM_INITIAL);

  const loadItem = useCallback(() => {
    dispatch(fetchItem(account.token, item.id));
  }, [account.token, dispatch, item.id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  useEffect(() => {
    if (fetchItemState.state === RequestStates.SUCCESS) {
      setFormData((data) => ({
        ...data,
        ...fetchItemState.item,
        price: parseDecimalToLocale(locale.languageTag, currency, fetchItemState.item.price),
        price_with_vat: parseDecimalToLocale(
          locale.languageTag,
          currency,
          fetchItemState.item.price_with_vat,
        ),
        vat_percent: fetchItemState.item.vat_percent.toString(),
      }));
    }
  }, [currency, fetchItemState.item, fetchItemState.state, item, locale.languageTag]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(editItemResetState());
    });
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (editItemState.state === RequestStates.SUCCESS) {
      if (onItemEdited) {
        const data = {...item, ...formData, ...getParsedItem(formData)};
        onItemEdited(data);
      }
      successToast.show(Translations.EDIT_ITEM_SUCCESS, successAnimation);
      return navigation.goBack();
    }
  }, [editItemState.state, formData, item, navigation, onItemEdited, successToast]);

  const dispatchEditItem = () => {
    const data = getParsedItem(formData);
    dispatch(editItem(item.id, account.token, data));
  };

  const renderContent = () => {
    switch (fetchItemState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_ITEM} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification message={Translations.LOADING_ITEM_FAILED} onPressButton={loadItem} />
        );
      case RequestStates.SUCCESS:
        return (
          <>
            {editItemState.state === RequestStates.LOADING && <FloatingLoading />}
            <ItemForm
              data={formData}
              onChange={setFormData}
              onSave={dispatchEditItem}
              error={editItemState.error}
            />
          </>
        );
      default:
        return null;
    }
  };

  return renderContent();
}
