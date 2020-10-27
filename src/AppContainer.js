import React, {useCallback, useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {fetchAccountDetails} from './services/store/actions/account/fetchAccountDetails';
import {fetchInvoices} from './services/store/actions/invoices/fetchInvoices';
import {resetApiError} from './services/store/actions/authentication/errorValidation';
import Translations from './services/localization/Translations';
import {fetchReceivedInvoices} from './services/store/actions/invoices/fetchReceivedInvoices';

import RequestStates from './constants/States/RequestStates';
import {ERROR_CODES, ERROR_TYPES} from './constants/Types/ErrorTypes';
import {dangerAnimation} from './constants/Animations';

import DrawerNavigator from './navigation/DrawerNavigator';
import LaunchingLoader from './components/Indicators/LaunchingLoader';
import ErrorNotification from './components/Notifications/ErrorNotification';
import SubscriptionErrorNotification from './components/Notifications/SubscriptionErrorNotification';
import ServiceMaintenanceNotification from './components/Notifications/ServiceMaintenanceNotification';

export default function AppContainer() {
  const dispatch = useDispatch();
  const errorValidationState = useSelector((store) => store.errorValidation);
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchInvoicesState = useSelector((store) => store.fetchInvoices);
  const fetchReceivedInvoicesState = useSelector((store) => store.fetchReceivedInvoices);

  const dangerToast = useSelector((store) => store.showToast.dangerToast);

  const [appState, setAppState] = useState(RequestStates.LOADING);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadData = useCallback(() => {
    setAppState(RequestStates.LOADING);
    setErrorMessage(null);
    dispatch(resetApiError());
    dispatch(fetchAccountDetails(account.token));
    dispatch(fetchInvoices(account.token));
    dispatch(fetchReceivedInvoices(account.token));
  }, [account.token, dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const isSuccess =
      accountDetails.state === RequestStates.SUCCESS &&
      fetchInvoicesState.state === RequestStates.SUCCESS &&
      fetchReceivedInvoicesState.state === RequestStates.SUCCESS;
    const isError =
      accountDetails.state === RequestStates.ERROR &&
      fetchInvoicesState.state === RequestStates.ERROR &&
      fetchReceivedInvoicesState.state === RequestStates.ERROR;
    if (isSuccess) {
      dispatch(resetApiError());
      setAppState(RequestStates.SUCCESS);
    } else if (isError) {
      setAppState(RequestStates.ERROR);
    }
  }, [accountDetails.state, fetchInvoicesState.state, fetchReceivedInvoicesState.state, dispatch]);

  useEffect(() => {
    const type = errorValidationState.error.type;
    const code = errorValidationState.error.code;
    switch (type) {
      case ERROR_TYPES.ERROR:
        if (code === ERROR_CODES.REQUEST_TIMED_OUT) {
          dangerToast.show(Translations.REQUEST_TOOK_TOO_LONG, dangerAnimation);
        }
        dispatch(resetApiError());
        break;
      case ERROR_TYPES.TYPE_ERROR:
        if (code === ERROR_CODES.NETWORK_REQUEST_FAILED) {
          dangerToast.show(Translations.CHECK_YOUR_NETWORK, dangerAnimation);
        }
        dispatch(resetApiError());
        break;
      case ERROR_TYPES.INVALID_REQUEST_ERROR:
        if (code === ERROR_CODES.CUSTOMER_DELETION_FAILED_DUE_TO_CUSTOMER_IS_ATTACHED_TO_INVOICE) {
          dangerToast.show(
            Translations.DELETE_CUSTOMER_FAILED_DUE_TO_OPEN_INVOICES,
            dangerAnimation,
          );
        }
        dispatch(resetApiError());
        break;
      case ERROR_TYPES.SUBSCRIPTION_ERROR:
        switch (code) {
          case ERROR_CODES.NO_ACTIVE_SUBSCRIPTION:
            setAppState(RequestStates.ERROR);
            setErrorMessage(Translations.SUBSCRIPTION_ERROR);
            break;
          case ERROR_CODES.NO_ACTIVE_SUBSCRIPTION_INCLUDING_PHONE_APPLICATION:
            setAppState(RequestStates.ERROR);
            setErrorMessage(Translations.SUBSCRIPTION_ERROR_INCLUDING_PHONE);
            break;
          case ERROR_CODES.PLAN_FEATURE_LIMIT_EXCEEDED:
            dangerToast.show(Translations.PLAN_FEATURE_LIMIT_EXCEEDED, dangerAnimation);
            break;
          default:
            return;
        }
        break;
      default:
        return;
    }
  }, [errorValidationState.error.type, errorValidationState.error.code, dangerToast, dispatch]);

  const renderApplication = () => {
    switch (appState) {
      case RequestStates.LOADING:
        return <LaunchingLoader />;
      case RequestStates.ERROR:
        switch (errorValidationState.error.type) {
          case ERROR_TYPES.SUBSCRIPTION_ERROR:
            return (
              <SubscriptionErrorNotification message={errorMessage} onPressButton={loadData} />
            );
          case ERROR_TYPES.ONGOING_MAINTENANCE:
            return <ServiceMaintenanceNotification onPressButton={loadData} />;
          default:
            return (
              <ErrorNotification
                message={Translations.LOADING_APPLICATION_FAILED}
                onPressButton={loadData}
              />
            );
        }
      case RequestStates.SUCCESS:
        return <DrawerNavigator />;
      default:
        return null;
    }
  };

  return renderApplication();
}
