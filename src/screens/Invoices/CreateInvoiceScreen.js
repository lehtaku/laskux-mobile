import React, {useState, useEffect, useCallback} from 'react';

import {StyleSheet, View} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';

import Translations from '../../services/localization/Translations';

import {
  createInvoice,
  createInvoicePreview,
  createInvoiceResetState,
} from '../../services/store/actions/invoices/createInvoice';
import {getParsedInvoice} from '../../utilities/parsers';

import {INVOICE_FORM_INITIAL} from '../../constants/States/FormStates';
import {FORM_TYPES} from '../../constants/Types/FormTypes';
import RequestStates from '../../constants/States/RequestStates';
import {successAnimation} from '../../constants/Animations';

import InvoiceForm from '../../components/Forms/InvoiceForm';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';
import MissingDetailsNotification from '../../components/Notifications/MissingDetailsNotification';
import {fetchAccountDetails} from '../../services/store/actions/account/fetchAccountDetails';
import {fetchServiceSettings} from '../../services/store/actions/service/fetchServiceSettings';

export default function CreateInvoiceScreen({navigation, route}) {
  const customer = route.params?.customer ?? null;
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const createInvoiceState = useSelector((store) => store.createInvoice);
  const fetchServiceSettingsState = useSelector((store) => store.fetchServiceSettings);
  const updateAccountDetailsState = useSelector((store) => store.updateAccountDetails);

  const successToast = useSelector((store) => store.showToast.successToast);

  const [invoiceFormData, setInvoiceFormData] = useState(INVOICE_FORM_INITIAL);

  const loadData = useCallback(
    (isRefreshing) => {
      dispatch(fetchAccountDetails(account.token, isRefreshing));
    },
    [dispatch, account.token],
  );

  const loadServiceSettings = useCallback(() => {
    dispatch(fetchServiceSettings(account.token));
  }, [dispatch, account.token]);

  useEffect(() => {
    if (customer) {
      setInvoiceFormData((data) => ({
        ...data,
        customer: customer,
      }));
    }
  }, [customer]);

  useEffect(() => {
    if (updateAccountDetailsState.state === RequestStates.SUCCESS) {
      loadData(true);
    }
  }, [loadData, updateAccountDetailsState.state]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  useEffect(() => {
    if (accountDetails.state === RequestStates.SUCCESS) {
      setInvoiceFormData((data) => ({
        ...data,
        terms_of_payment: accountDetails.settings.invoices.terms_of_payment.toString(),
        penalty_interest: accountDetails.settings.invoices.penalty_interest.toString(),
      }));
      const defaultBankAccount = accountDetails.bank_accounts.find((item) => item.default === 1);
      if (defaultBankAccount) {
        setInvoiceFormData((data) => ({
          ...data,
          bank_account_id: defaultBankAccount.id,
        }));
      }
    }
  }, [
    accountDetails.state,
    accountDetails.settings.invoices.terms_of_payment,
    accountDetails.settings.invoices.penalty_interest,
    accountDetails.bank_accounts,
  ]);

  useEffect(() => {
    const hasZeroVatValues = invoiceFormData.items.some(
      (item) => item.vat_percent === 0 || item.vat_percent === '0',
    );
    if (hasZeroVatValues && fetchServiceSettingsState.state === null) {
      loadServiceSettings();
    }
  }, [fetchServiceSettingsState.state, invoiceFormData.items, loadServiceSettings]);

  useEffect(() => {
    if (fetchServiceSettingsState.state === RequestStates.SUCCESS) {
      setInvoiceFormData((data) => ({
        ...data,
        vat_code: fetchServiceSettingsState.invoices.vat_code,
        vat0_free_text: fetchServiceSettingsState.invoices.vat0_free_text,
      }));
    }
  }, [
    fetchServiceSettingsState.state,
    fetchServiceSettingsState.invoices.vat_code,
    fetchServiceSettingsState.invoices.vat0_free_text,
  ]);

  useEffect(() => {
    if (createInvoiceState.state === RequestStates.SUCCESS) {
      successToast.show(Translations.CREATE_INVOICE_SUCCESS, successAnimation);
      dispatch(createInvoiceResetState());
      return navigation.navigate({name: 'Invoices'});
    } else if (createInvoiceState.state === RequestStates.SEND_SUCCESS) {
      successToast.show(Translations.SEND_INVOICE_SUCCESS, successAnimation);
      dispatch(createInvoiceResetState());
      return navigation.navigate({name: 'Invoices'});
    }
  }, [createInvoiceState.state, dispatch, successToast, navigation]);

  const dispatchCreatePreview = () => {
    const data = getParsedInvoice(invoiceFormData);
    dispatch(createInvoicePreview(account.token, data));
  };

  const dispatchCreateInvoice = () => {
    const data = {
      ...getParsedInvoice(invoiceFormData),
      send: false,
    };
    dispatch(createInvoice(account.token, data));
  };

  const dispatchCreateAndSendInvoice = (emailData) => {
    const data = {
      ...getParsedInvoice(invoiceFormData),
      ...emailData,
      send: true,
    };
    dispatch(createInvoice(account.token, data));
  };

  const navToFillDetails = () => {
    navigation.navigate('AccountDetails');
  };

  const onLeave = () => {
    dispatch(createInvoiceResetState());
    navigation.goBack();
  };

  const isLoading = () => {
    return createInvoiceState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    if (!accountDetails.details.details_filled) {
      return <MissingDetailsNotification onPressButton={navToFillDetails} />;
    }
    return (
      <View style={styles.container}>
        {isLoading() && <FloatingLoading />}
        <InvoiceForm
          formData={invoiceFormData}
          onChange={setInvoiceFormData}
          state={createInvoiceState.state}
          error={createInvoiceState.error}
          previewData={createInvoiceState.previewData}
          onPreview={dispatchCreatePreview}
          onSave={dispatchCreateInvoice}
          onSend={dispatchCreateAndSendInvoice}
          onLeave={onLeave}
          formType={FORM_TYPES.CREATE}
        />
      </View>
    );
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
