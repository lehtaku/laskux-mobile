import {getRequest} from '../../../api/get';

export const FETCH_CUSTOMER_REQUEST = 'FETCH_CUSTOMER_REQUEST';
function fetchCustomerRequest() {
  return {
    type: FETCH_CUSTOMER_REQUEST,
  };
}

export const FETCH_CUSTOMER_REFRESH = 'FETCH_CUSTOMER_REFRESH';
function fetchCustomerRefresh() {
  return {
    type: FETCH_CUSTOMER_REFRESH,
  };
}

export const FETCH_CUSTOMER_SUCCESS = 'FETCH_CUSTOMER_SUCCESS';
function fetchCustomerSuccess(data) {
  return {
    type: FETCH_CUSTOMER_SUCCESS,
    payload: data,
  };
}

export const FETCH_CUSTOMER_FAILURE = 'FETCH_CUSTOMER_FAILURE';
function fetchCustomerFailure(error) {
  return {
    type: FETCH_CUSTOMER_FAILURE,
    payload: error,
  };
}

export const FETCH_CUSTOMER_RESET_STATE = 'FETCH_CUSTOMER_RESET_STATE';
export function fetchCustomerResetState() {
  return {
    type: FETCH_CUSTOMER_RESET_STATE,
  };
}

export function fetchCustomer(token, customerId, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchCustomerRefresh());
    } else {
      dispatch(fetchCustomerRequest());
    }
    try {
      const customer = await getRequest(`/customers/${customerId}`, token);
      dispatch(fetchCustomerSuccess(customer));
    } catch (error) {
      dispatch(fetchCustomerFailure(error));
    }
  };
}
