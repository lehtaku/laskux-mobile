import {postRequest} from '../../../api/post';

export const SEND_INVOICE_REQUEST = 'SEND_INVOICE_REQUEST';
function sendInvoiceRequest() {
  return {
    type: SEND_INVOICE_REQUEST,
  };
}

export const SEND_INVOICE_SUCCESS = 'SEND_INVOICE_SUCCESS';
function sendInvoiceSuccess() {
  return {
    type: SEND_INVOICE_SUCCESS,
  };
}

export const SEND_INVOICE_FAILURE = 'SEND_INVOICE_FAILURE';
function sendInvoiceFailure(error) {
  return {
    type: SEND_INVOICE_FAILURE,
    payload: error,
  };
}

export const SEND_INVOICE_RESET_STATE = 'SEND_INVOICE_RESET_STATE';
export function sendInvoiceResetState() {
  return {
    type: SEND_INVOICE_RESET_STATE,
  };
}

export function sendInvoice(invoiceId, token, data) {
  return async function (dispatch) {
    dispatch(sendInvoiceRequest());
    try {
      await postRequest(`/invoices/${invoiceId}/send`, token, data);
      dispatch(sendInvoiceSuccess());
    } catch (error) {
      dispatch(sendInvoiceFailure(error));
    }
  };
}
