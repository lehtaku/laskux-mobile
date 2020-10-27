import React, {useEffect, useState} from 'react';

import Translations from '../../services/localization/Translations';

import {useDispatch, useSelector} from 'react-redux';
import {createItem, createItemResetState} from '../../services/store/actions/items/createItem';

import {getParsedItem} from '../../utilities/parsers';

import RequestStates from '../../constants/States/RequestStates';
import {successAnimation} from '../../constants/Animations';
import {ITEM_FORM_INITIAL} from '../../constants/States/FormStates';

import ItemForm from '../../components/Forms/ItemForm';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';
import {EXCLUDING_VAT, INCLUDING_VAT} from '../../constants/Params/ItemParams';
import {VAT_TYPES} from '../../constants/Types/VatTypes';

export default function CreateItemScreen({navigation, route}) {
  const onItemCreated = route.params?.onItemCreated;

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const createItemState = useSelector((store) => store.createItem);

  const successToast = useSelector((store) => store.showToast.successToast);

  const [formData, setFormData] = useState(ITEM_FORM_INITIAL);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(createItemResetState());
    });
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (accountDetails.state === RequestStates.SUCCESS) {
      setFormData((data) => ({
        ...data,
        unit: accountDetails.settings.items.default_unit,
        vat_method: accountDetails.settings.items.vat_type,
        vat_percent: accountDetails.settings.items.default_vat.toString(),
      }));
      switch (accountDetails.settings.items.vat_type) {
        case EXCLUDING_VAT:
          return setFormData((data) => ({
            ...data,
            vat_method: VAT_TYPES.GROSS,
          }));
        case INCLUDING_VAT:
          return setFormData((data) => ({
            ...data,
            vat_method: VAT_TYPES.NET,
          }));
        default:
          return;
      }
    }
  }, [
    accountDetails.state,
    accountDetails.settings.items.default_vat,
    accountDetails.settings.items.default_unit,
    accountDetails.settings.items.vat_type,
  ]);

  useEffect(() => {
    if (createItemState.state === RequestStates.SUCCESS) {
      if (onItemCreated) {
        const data = {...getParsedItem(formData), ...createItemState.data};
        onItemCreated(data);
      }
      successToast.show(Translations.CREATE_ITEM_SUCCESS, successAnimation);
      return navigation.goBack();
    }
  }, [
    createItemState.data,
    createItemState.state,
    formData,
    navigation,
    onItemCreated,
    successToast,
  ]);

  const dispatchCreateItem = () => {
    const data = getParsedItem(formData);
    dispatch(createItem(account.token, data));
  };

  return (
    <>
      {createItemState.state === RequestStates.LOADING && <FloatingLoading />}
      <ItemForm
        data={formData}
        onChange={setFormData}
        onSave={dispatchCreateItem}
        error={createItemState.error}
      />
    </>
  );
}
