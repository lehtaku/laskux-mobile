import React, {useState, useEffect, useCallback} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {
  createCustomer,
  createCustomerResetState,
} from '../../services/store/actions/customers/createCustomer';
import {fetchServiceSettings} from '../../services/store/actions/service/fetchServiceSettings';
import {searchCompanyByNameResetState} from '../../services/store/actions/tools/searchCompanyByName';
import {searchCompanyByIdResetState} from '../../services/store/actions/tools/searchCompanyById';
import Translations from '../../services/localization/Translations';
import {getParsedCustomer} from '../../utilities/parsers';
import {fetchAccountDetails} from '../../services/store/actions/account/fetchAccountDetails';

import RequestStates from '../../constants/States/RequestStates';
import {successAnimation} from '../../constants/Animations';
import {FORM_TYPES} from '../../constants/Types/FormTypes';
import {CUSTOMER_FORM_INITIAL} from '../../constants/States/FormStates';

import CustomerForm from '../../components/Forms/CustomerForm';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';

export default function CreateCustomerScreen({navigation, route}) {
  const onCustomerCreated = route.params?.onCustomerCreated;

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const createCustomerState = useSelector((store) => store.createCustomer);
  const fetchServiceSettingState = useSelector((store) => store.fetchServiceSettings);
  const searchCompanyByIdState = useSelector((store) => store.searchCompanyById);

  const successToast = useSelector((store) => store.showToast.successToast);

  const [formData, setFormData] = useState(CUSTOMER_FORM_INITIAL);

  const loadData = useCallback(() => {
    dispatch(fetchAccountDetails(account.token));
    dispatch(fetchServiceSettings(account.token));
  }, [dispatch, account.token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(createCustomerResetState());
      dispatch(searchCompanyByNameResetState());
      dispatch(searchCompanyByIdResetState());
    });
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (accountDetails.state === RequestStates.SUCCESS) {
      setFormData((data) => ({
        ...data,
        customer_number: accountDetails.customers.next_customer_number,
      }));
    }
  }, [accountDetails.state, accountDetails.customers.next_customer_number]);

  useEffect(() => {
    if (fetchServiceSettingState.state === RequestStates.SUCCESS) {
      setFormData((data) => ({
        ...data,
        type: fetchServiceSettingState.customers.default_customer_type,
      }));
    }
  }, [
    dispatch,
    fetchServiceSettingState.state,
    fetchServiceSettingState.customers.default_customer_type,
  ]);

  useEffect(() => {
    if (createCustomerState.state === RequestStates.SUCCESS) {
      if (onCustomerCreated) {
        onCustomerCreated({...formData, ...createCustomerState.data});
      }
      successToast.show(Translations.CREATE_CUSTOMER_SUCCESS, successAnimation);
      return navigation.goBack();
    }
  }, [
    createCustomerState.data,
    createCustomerState.state,
    formData,
    navigation,
    onCustomerCreated,
    successToast,
  ]);

  useEffect(() => {
    if (searchCompanyByIdState.state === RequestStates.SUCCESS) {
      setFormData((data) => ({
        ...data,
        ...searchCompanyByIdState.details,
      }));
      if (searchCompanyByIdState.details.e_invoicing_addresses.length === 1) {
        setFormData((data) => ({
          ...data,
          e_invoicing_operator: {
            id: searchCompanyByIdState.details.e_invoicing_addresses[0].e_invoicing_operator_id,
          },
        }));
      }
    }
  }, [searchCompanyByIdState.state, searchCompanyByIdState.details]);

  const dispatchCreateCustomer = () => {
    const data = getParsedCustomer(formData);
    dispatch(createCustomer(account.token, data));
  };

  return (
    <>
      {createCustomerState.state === RequestStates.LOADING && <FloatingLoading />}
      <CustomerForm
        data={formData}
        onChange={setFormData}
        onSave={dispatchCreateCustomer}
        error={createCustomerState.error}
        formType={FORM_TYPES.CREATE}
      />
    </>
  );
}
