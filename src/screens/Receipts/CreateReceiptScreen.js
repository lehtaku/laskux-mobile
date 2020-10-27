import React, {useCallback, useEffect, useState} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {addReceipt} from '../../services/store/actions/receipts/addReceipt';
import {
  completeReceipt,
  completeReceiptResetState,
} from '../../services/store/actions/receipts/completeReceipt';
import Translations from '../../services/localization/Translations';
import {getFieldError} from '../../utilities/validations';
import {getParsedReceipt} from '../../utilities/parsers';
import {fetchSellers} from '../../services/store/actions/sellers/fetchSellers';

import RequestStates from '../../constants/States/RequestStates';
import {dangerAnimation, successAnimation} from '../../constants/Animations';
import {RECEIPT_FORM_INITIAL} from '../../constants/States/FormStates';

import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';
import ReceiptForm from '../../components/Forms/ReceiptForm';

export default function CreateReceiptScreen({navigation}) {
  const dispatch = useDispatch();
  const {token} = useSelector((store) => store.fetchAccount);
  const addReceiptState = useSelector((store) => store.addReceipt);
  const completeReceiptState = useSelector((store) => store.completeReceipt);
  const fetchSellersState = useSelector((store) => store.fetchSellers);

  const [isFormEdited, setIsFormEdited] = useState(false);

  const dangerToast = useSelector((store) => store.showToast.dangerToast);
  const successToast = useSelector((store) => store.showToast.successToast);

  const [formData, setFormData] = useState(RECEIPT_FORM_INITIAL);

  const isExistingSeller = useCallback(() => {
    return fetchSellersState.sellers.some(({id}) => id === formData.seller.id);
  }, [fetchSellersState.sellers, formData.seller.id]);

  useEffect(() => {
    if (formData.attachments.length) {
      dispatch(
        addReceipt(token, {
          attachments: formData.attachments,
        }),
      );
    }
  }, [formData.attachments, dispatch, token]);

  useEffect(() => {
    if (addReceiptState.state === RequestStates.SUCCESS && !isFormEdited) {
      const {
        payment_method_id,
        payment_and_loss_account_id,
        receipt_date,
        description,
        rows,
      } = addReceiptState.receipt;
      const scannedDate = receipt_date ? receipt_date : Date.now();
      const scannedRows = rows.length
        ? rows
        : [
            {
              gross_amount: 0,
              net_amount: 0,
              vat_amount: 0,
              vat_percent: 0,
            },
          ];
      setFormData((data) => ({
        ...data,
        payment_method_id: payment_method_id,
        payment_and_loss_account_id: payment_and_loss_account_id,
        receipt_date: scannedDate,
        description: description,
        rows: scannedRows,
      }));
    }
  }, [addReceiptState.receipt, addReceiptState.state, isFormEdited]);

  useEffect(() => {
    if (completeReceiptState.state === RequestStates.SUCCESS) {
      if (!isExistingSeller()) {
        dispatch(fetchSellers(token));
      }
      successToast.show(Translations.ADD_RECEIPT_SUCCESS, successAnimation);
      return navigation.goBack();
    } else if (completeReceiptState.state === RequestStates.ERROR) {
      if (getFieldError(completeReceiptState.error, 'rows')) {
        dangerToast.show(Translations.CHECK_RECEIPT_BREAKDOWN, dangerAnimation);
      }
    }
  }, [
    completeReceiptState.error,
    completeReceiptState.state,
    dangerToast,
    navigation,
    successToast,
  ]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(completeReceiptResetState());
    });
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [dispatch, navigation]);

  const dispatchCompleteReceipt = () => {
    if (formData.attachments.length < 1) {
      return dangerToast.show(Translations.RECEIPT_MUST_CONTAIN_ATTACHMENT, dangerAnimation);
    }
    let parsedReceipt = getParsedReceipt(formData);
    const isExistingSeller = fetchSellersState.sellers.some(
      (seller) => seller.id === formData.seller.id,
    );
    if (!isExistingSeller) {
      parsedReceipt = {...parsedReceipt, seller: {id: null, name: formData.seller.name}};
    }
    if (fetchSellersState.sellers.some((seller) => seller.id)) {
      dispatch(completeReceipt(addReceiptState.receipt.id, token, parsedReceipt));
    }
  };

  const isLoading = () => {
    return (
      addReceiptState.state === RequestStates.LOADING ||
      completeReceiptState.state === RequestStates.LOADING
    );
  };

  const updateForm = (data) => {
    setIsFormEdited(true);
    setFormData(data);
  };

  return (
    <>
      {isLoading() && <FloatingLoading />}
      <ReceiptForm
        navigation={navigation}
        formData={formData}
        onChange={updateForm}
        onSave={dispatchCompleteReceipt}
        error={completeReceiptState.error}
        showAddAttachmentButton={true}
      />
    </>
  );
}
