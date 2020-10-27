import {getRequest} from '../../../api/get';

export const FETCH_INVOICE_REQUEST = 'FETCH_INVOICE_REQUEST';
function fetchInvoiceRequest() {
  return {
    type: FETCH_INVOICE_REQUEST,
  };
}

export const FETCH_INVOICE_REFRESH = 'FETCH_INVOICE_REFRESH';
function fetchInvoiceRefresh() {
  return {
    type: FETCH_INVOICE_REFRESH,
  };
}

export const FETCH_INVOICE_SUCCESS = 'FETCH_INVOICE_SUCCESS';
function fetchInvoiceSuccess(data) {
  return {
    type: FETCH_INVOICE_SUCCESS,
    payload: data,
  };
}

export const FETCH_INVOICE_FAILURE = 'FETCH_INVOICE_FAILURE';
function fetchInvoiceFailure(error) {
  return {
    type: FETCH_INVOICE_FAILURE,
    payload: error,
  };
}

export const FETCH_INVOICE_RESET_STATE = 'FETCH_INVOICE_RESET_STATE';
export function fetchInvoiceResetState() {
  return {
    type: FETCH_INVOICE_RESET_STATE,
  };
}

export function fetchInvoice(invoiceId, token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchInvoiceRefresh());
    } else {
      dispatch(fetchInvoiceRequest());
    }
    try {
      const invoice = await getRequest(`/invoice/${invoiceId}`, token);
      dispatch(fetchInvoiceSuccess(invoice));
    } catch (error) {
      dispatch(fetchInvoiceFailure(error));
    }
  };
}
