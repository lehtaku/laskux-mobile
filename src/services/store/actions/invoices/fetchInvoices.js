import {getRequest} from '../../../api/get';

export const FETCH_INVOICES_REQUEST = 'FETCH_INVOICES_REQUEST';
function fetchInvoicesRequest() {
  return {
    type: FETCH_INVOICES_REQUEST,
  };
}

export const FETCH_INVOICES_REFRESH = 'FETCH_INVOICES_REFRESH';
function fetchInvoicesRefresh() {
  return {
    type: FETCH_INVOICES_REFRESH,
  };
}

export const FETCH_INVOICES_SUCCESS = 'FETCH_INVOICES_SUCCESS';
function fetchInvoicesSuccess(data) {
  return {
    type: FETCH_INVOICES_SUCCESS,
    payload: data,
  };
}

export const FETCH_INVOICES_FAILURE = 'FETCH_INVOICES_FAILURE';
function fetchInvoicesFailure(error) {
  return {
    type: FETCH_INVOICES_FAILURE,
    payload: error,
  };
}

export const FETCH_INVOICES_RESET_STATE = 'FETCH_INVOICES_RESET_STATE';
export function fetchInvoicesResetState() {
  return {
    type: FETCH_INVOICES_RESET_STATE,
  };
}

export function fetchInvoices(token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchInvoicesRefresh());
    } else {
      dispatch(fetchInvoicesRequest());
    }
    try {
      const invoices = await getRequest('/invoices', token);
      dispatch(fetchInvoicesSuccess(invoices));
    } catch (error) {
      dispatch(fetchInvoicesFailure(error));
    }
  };
}
