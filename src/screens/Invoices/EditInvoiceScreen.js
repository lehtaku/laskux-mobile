import React, {useState, useEffect, useCallback, useContext} from 'react';

import {StyleSheet, View} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {fetchInvoice} from '../../services/store/actions/invoices/fetchInvoice';
import {
  editInvoice,
  editInvoicePreview,
  editInvoiceResetState,
} from '../../services/store/actions/invoices/editInvoice';
import Translations from '../../services/localization/Translations';

import {parseDecimalToLocale} from '../../utilities/currencies';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {getParsedInvoice} from '../../utilities/parsers';

import {INVOICE_FORM_INITIAL} from '../../constants/States/FormStates';
import RequestStates from '../../constants/States/RequestStates';
import {successAnimation} from '../../constants/Animations';
import {FORM_TYPES} from '../../constants/Types/FormTypes';

import ErrorNotification from '../../components/Notifications/ErrorNotification';
import InvoiceForm from '../../components/Forms/InvoiceForm';
import Loading from '../../components/Indicators/Loading';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';
import {parseDecimalToString} from '../../utilities/calculation';

export default function EditInvoiceScreen({navigation, route}) {
  const dispatch = useDispatch();
  const invoice = route.params?.invoice;

  const {locale, currency} = useContext(LocalizationContext);

  const account = useSelector((store) => store.fetchAccount);
  const fetchInvoiceState = useSelector((store) => store.fetchInvoice);
  const editInvoiceState = useSelector((store) => store.editInvoice);

  const successToast = useSelector((store) => store.showToast.successToast);

  const [invoiceFormData, setInvoiceFormData] = useState(INVOICE_FORM_INITIAL);

  const loadData = useCallback(
    (isInitial) => {
      dispatch(fetchInvoice(invoice.id, account.token, isInitial));
    },
    [account.token, dispatch, invoice.id],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  useEffect(() => {
    if (editInvoiceState.state === RequestStates.SUCCESS) {
      successToast.show(Translations.EDIT_INVOICE_SUCCESS, successAnimation);
      dispatch(editInvoiceResetState());
      return navigation.navigate({name: 'Invoices'});
    } else if (editInvoiceState.state === RequestStates.SEND_SUCCESS) {
      successToast.show(Translations.SEND_INVOICE_SUCCESS, successAnimation);
      dispatch(editInvoiceResetState());
      return navigation.navigate({name: 'Invoices'});
    }
  }, [editInvoiceState.state, dispatch, successToast, navigation]);

  useEffect(() => {
    if (fetchInvoiceState.state === RequestStates.SUCCESS) {
      const fetchedInvoice = fetchInvoiceState.invoice;
      setInvoiceFormData((data) => ({
        ...data,
        ...fetchInvoiceState.invoice,
        bank_account_id: fetchedInvoice.bank_account_id,
        invoice_date: new Date(fetchedInvoice.invoice_date),
        items: fetchedInvoice.items.map((item) => {
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
        discount_rows: fetchedInvoice.discount_rows.map((item) => {
          return {
            name: item.name,
            price: parseDecimalToLocale(locale.languageTag, currency, -1 * parseFloat(item.price)),
            price_with_vat: parseDecimalToLocale(
              locale.languageTag,
              currency,
              -1 * parseFloat(item.price_with_vat),
            ),
            vat_method: item.vat_method,
            vat_percent: item.vat_percent.toString(),
            vat_price: parseDecimalToString(-1 * parseFloat(item.vat_price)),
          };
        }),
        penalty_interest: fetchedInvoice.penalty_interest.toString(),
        terms_of_payment: fetchedInvoice.terms_of_payment.toString(),
      }));
    }
  }, [currency, locale.languageTag, fetchInvoiceState.invoice, fetchInvoiceState.state]);

  const dispatchCreatePreview = () => {
    const data = getParsedInvoice(invoiceFormData);
    dispatch(editInvoicePreview(account.token, data));
  };

  const dispatchEditInvoice = () => {
    const data = {
      ...getParsedInvoice(invoiceFormData),
      send: false,
    };
    dispatch(editInvoice(invoice.id, account.token, data));
  };

  const dispatchEditAndSendInvoice = (emailData) => {
    const data = {
      ...getParsedInvoice(invoiceFormData),
      ...emailData,
      send: true,
    };
    dispatch(editInvoice(invoice.id, account.token, data));
  };

  const onLeave = () => {
    dispatch(editInvoiceResetState());
    navigation.goBack();
  };

  const isLoading = () => {
    return editInvoiceState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    switch (fetchInvoiceState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_INVOICE} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_INVOICE_FAILED}
            onPressButton={loadData}
          />
        );
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <InvoiceForm
              formData={invoiceFormData}
              onChange={setInvoiceFormData}
              state={editInvoiceState.state}
              error={editInvoiceState.error}
              previewData={editInvoiceState.previewData}
              onPreview={dispatchCreatePreview}
              onSave={dispatchEditInvoice}
              onSend={dispatchEditAndSendInvoice}
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
