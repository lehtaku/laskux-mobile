import {getRequest} from '../../../api/get';

export const FETCH_RECEIVED_INVOICES_REQUEST = 'FETCH_RECEIVED_INVOICES_REQUEST';
function fetchReceivedInvoicesRequest() {
  return {
    type: FETCH_RECEIVED_INVOICES_REQUEST,
  };
}

export const FETCH_RECEIVED_INVOICES_REFRESH = 'FETCH_RECEIVED_INVOICES_REFRESH';
function fetchReceivedInvoicesRefresh() {
  return {
    type: FETCH_RECEIVED_INVOICES_REFRESH,
  };
}

export const FETCH_RECEIVED_INVOICES_SUCCESS = 'FETCH_RECEIVED_INVOICES_SUCCESS';
function fetchReceivedInvoicesSuccess(data) {
  return {
    type: FETCH_RECEIVED_INVOICES_SUCCESS,
    payload: data,
  };
}

export const FETCH_RECEIVED_INVOICES_FAILURE = 'FETCH_RECEIVED_INVOICES_FAILURE';
function fetchReceivedInvoicesFailure(error) {
  return {
    type: FETCH_RECEIVED_INVOICES_FAILURE,
    payload: error,
  };
}

export const FETCH_RECEIVED_INVOICES_RESET_STATE = 'FETCH_RECEIVED_INVOICES_RESET_STATE';
export function fetchReceivedInvoicesResetState() {
  return {
    type: FETCH_RECEIVED_INVOICES_RESET_STATE,
  };
}

export function fetchReceivedInvoices(token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchReceivedInvoicesRefresh());
    } else {
      dispatch(fetchReceivedInvoicesRequest());
    }
    try {
      const invoices = await getRequest('/received-invoices', token);
      dispatch(fetchReceivedInvoicesSuccess(invoices));
    } catch (error) {
      dispatch(fetchReceivedInvoicesFailure(error));
    }
  };
}
