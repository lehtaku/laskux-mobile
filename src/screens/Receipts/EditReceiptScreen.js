import React, {useCallback, useContext, useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';

import {getParsedReceipt} from '../../utilities/parsers';
import {
  editReceipt,
  editReceiptResetState,
} from '../../services/store/actions/receipts/editReceipt';
import {fetchReceipt} from '../../services/store/actions/receipts/fetchReceipt';
import {fetchReceiptAttachments} from '../../services/store/actions/receipts/fetchReceiptAttachments';
import Translations from '../../services/localization/Translations';
import {parseDecimalToLocale} from '../../utilities/currencies';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {getFieldError} from '../../utilities/validations';

import {RECEIPT_FORM_INITIAL} from '../../constants/States/FormStates';
import RequestStates from '../../constants/States/RequestStates';
import {dangerAnimation, successAnimation} from '../../constants/Animations';

import FloatingLoading from '../../components/Indicators/FloatingLoading';
import ReceiptForm from '../../components/Forms/ReceiptForm';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';

export default function EditReceiptScreen({navigation, route}) {
  const receipt = route.params?.receipt;

  const dispatch = useDispatch();
  const {token} = useSelector((store) => store.fetchAccount);
  const fetchReceiptState = useSelector((store) => store.fetchReceipt);
  const fetchReceiptAttachmentsState = useSelector((store) => store.fetchReceiptAttachments);
  const editReceiptState = useSelector((store) => store.editReceipt);
  const fetchSellersState = useSelector((store) => store.fetchSellers);

  const dangerToast = useSelector((store) => store.showToast.dangerToast);
  const successToast = useSelector((store) => store.showToast.successToast);

  const {locale, currency} = useContext(LocalizationContext);

  const [formData, setFormData] = useState(RECEIPT_FORM_INITIAL);

  const loadData = useCallback(() => {
    dispatch(fetchReceipt(receipt.id, token));
    dispatch(fetchReceiptAttachments(receipt.id, token));
  }, [token, dispatch, receipt.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (fetchReceiptState.state === RequestStates.SUCCESS) {
      const {
        description,
        receipt_date,
        payment_method_id,
        profit_and_loss_account_id,
        rows,
      } = fetchReceiptState.receipt;
      setFormData((data) => ({
        ...data,
        description,
        receipt_date: new Date(receipt_date),
        payment_method_id,
        profit_and_loss_account_id,
        rows: rows.map((row) => ({
          ...row,
          gross_amount: parseDecimalToLocale(locale.languageTag, currency, row.gross_amount),
          net_amount: parseDecimalToLocale(locale.languageTag, currency, row.net_amount),
          vat_amount: parseDecimalToLocale(locale.languageTag, currency, row.vat_amount),
          vat_percent: row.vat_percent.toString(),
        })),
      }));
    }
  }, [currency, fetchReceiptState.receipt, fetchReceiptState.state, locale.languageTag]);

  useEffect(() => {
    if (
      fetchReceiptState.state === RequestStates.SUCCESS &&
      fetchSellersState.state === RequestStates.SUCCESS
    ) {
      const {seller_id} = fetchReceiptState.receipt;
      const seller = fetchSellersState.sellers.find(
        (sellerToFind) => sellerToFind.id === seller_id,
      );
      if (seller) {
        setFormData((data) => ({
          ...data,
          seller,
        }));
      }
    }
  }, [
    fetchReceiptState.receipt,
    fetchReceiptState.state,
    fetchSellersState.sellers,
    fetchSellersState.state,
  ]);

  useEffect(() => {
    if (fetchReceiptAttachmentsState.state === RequestStates.SUCCESS) {
      setFormData((data) => ({
        ...data,
        attachments: fetchReceiptAttachmentsState.attachments.map(({mime_type, file}) => {
          return {
            data: `data:${mime_type};base64,${file}`,
          };
        }),
      }));
    }
  }, [fetchReceiptAttachmentsState.attachments, fetchReceiptAttachmentsState.state]);

  useEffect(() => {
    if (editReceiptState.state === RequestStates.SUCCESS) {
      successToast.show(Translations.EDIT_RECEIPT_SUCCESS, successAnimation);
      return navigation.goBack();
    } else if (editReceiptState.state === RequestStates.ERROR) {
      if (getFieldError(editReceiptState.error, 'rows')) {
        dangerToast.show(Translations.CHECK_RECEIPT_BREAKDOWN, dangerAnimation);
      }
    }
  }, [dangerToast, editReceiptState.error, editReceiptState.state, navigation, successToast]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(editReceiptResetState());
    });
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [dispatch, navigation]);

  const dispatchEditReceipt = () => {
    let parsedReceipt = getParsedReceipt(formData);
    const isExistingSeller = fetchSellersState.sellers.some(
      (seller) => seller.id === formData.seller.id,
    );
    if (!isExistingSeller) {
      parsedReceipt = {...parsedReceipt, seller: {id: null, name: formData.seller.name}};
    }
    dispatch(editReceipt(receipt.id, token, parsedReceipt));
  };

  const isLoading = () => {
    return editReceiptState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    switch (fetchReceiptState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_RECEIPT} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_RECEIPT_FAILED}
            onPressButton={() => loadData()}
          />
        );
      case RequestStates.SUCCESS:
        return (
          <>
            {isLoading() && <FloatingLoading />}
            <ReceiptForm
              navigation={navigation}
              formData={formData}
              onChange={setFormData}
              onSave={dispatchEditReceipt}
              error={editReceiptState.error}
            />
          </>
        );
      default:
        return null;
    }
  };

  return renderContent();
}
