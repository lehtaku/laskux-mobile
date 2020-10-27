import React, {useCallback, useEffect, useState} from 'react';

import Translations from '../../services/localization/Translations';
import {useDispatch, useSelector} from 'react-redux';
import {
  editCustomer,
  editCustomerResetState,
} from '../../services/store/actions/customers/editCustomer';
import {fetchCustomer} from '../../services/store/actions/customers/fetchCustomer';
import {getParsedCustomer} from '../../utilities/parsers';

import RequestStates from '../../constants/States/RequestStates';
import {successAnimation} from '../../constants/Animations';
import {FORM_TYPES} from '../../constants/Types/FormTypes';
import {CUSTOMER_FORM_INITIAL} from '../../constants/States/FormStates';

import CustomerForm from '../../components/Forms/CustomerForm';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';

export default function EditCustomerScreen({navigation, route}) {
  const customer = route.params?.customer;
  const onCustomerEdited = route.params?.onCustomerEdited;

  const successToast = useSelector((store) => store.showToast.successToast);

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const editCustomerState = useSelector((store) => store.editCustomer);
  const fetchCustomerState = useSelector((store) => store.fetchCustomer);

  const [formData, setFormData] = useState(CUSTOMER_FORM_INITIAL);

  const loadCustomer = useCallback(
    (isRefreshing) => {
      dispatch(fetchCustomer(account.token, customer.id, isRefreshing));
    },
    [account.token, customer.id, dispatch],
  );

  const refresh = useCallback(() => {
    loadCustomer(true);
  }, [loadCustomer]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  useEffect(() => {
    if (fetchCustomerState.state === RequestStates.SUCCESS) {
      setFormData((data) => ({
        ...data,
        ...fetchCustomerState.customer,
      }));
    }
  }, [customer, fetchCustomerState]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(editCustomerResetState());
    });
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={() => navigation.goBack()} />,
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (editCustomerState.state === RequestStates.SUCCESS) {
      if (onCustomerEdited) {
        const data = {...customer, ...formData, ...editCustomerState.data};
        onCustomerEdited(data);
      }
      successToast.show(Translations.EDIT_CUSTOMER_SUCCESS, successAnimation);
      return navigation.goBack();
    }
  }, [
    editCustomerState.state,
    editCustomerState.data,
    customer,
    formData,
    navigation,
    onCustomerEdited,
    successToast,
  ]);

  const dispatchEditCustomer = () => {
    const data = getParsedCustomer(formData);
    dispatch(editCustomer(customer.id, account.token, data));
  };

  const renderContent = () => {
    switch (fetchCustomerState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_CUSTOMER} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_CUSTOMER_FAILED}
            onPressButton={() => loadCustomer()}
          />
        );
      case RequestStates.REFRESHING:
      case RequestStates.SUCCESS:
        return (
          <>
            {editCustomerState.state === RequestStates.LOADING && <FloatingLoading />}
            <CustomerForm
              data={formData}
              onChange={setFormData}
              onSave={dispatchEditCustomer}
              onRefresh={refresh}
              error={editCustomerState.error}
              formType={FORM_TYPES.EDIT}
            />
          </>
        );
      default:
        return null;
    }
  };

  return renderContent();
}
