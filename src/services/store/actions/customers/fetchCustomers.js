import {getRequest} from '../../../api/get';

export const FETCH_CUSTOMERS_REQUEST = 'FETCH_CUSTOMERS_REQUEST';
function fetchCustomersRequest() {
  return {
    type: FETCH_CUSTOMERS_REQUEST,
  };
}

export const FETCH_CUSTOMERS_REFRESH = 'FETCH_CUSTOMERS_REFRESH';
function fetchCustomersRefresh() {
  return {
    type: FETCH_CUSTOMERS_REFRESH,
  };
}

export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
function fetchCustomersSuccess(data) {
  return {
    type: FETCH_CUSTOMERS_SUCCESS,
    payload: data,
  };
}

export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE';
function fetchCustomersFailure(error) {
  return {
    type: FETCH_CUSTOMERS_FAILURE,
    payload: error,
  };
}

export const FETCH_CUSTOMERS_RESET_STATE = 'FETCH_CUSTOMERS_RESET_STATE';
export function fetchCustomersResetState() {
  return {
    type: FETCH_CUSTOMERS_RESET_STATE,
  };
}

export function fetchCustomers(path, token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchCustomersRefresh());
    } else {
      dispatch(fetchCustomersRequest());
    }
    try {
      const customers = await getRequest(path, token);
      dispatch(fetchCustomersSuccess(customers));
    } catch (error) {
      dispatch(fetchCustomersFailure(error));
    }
  };
}
