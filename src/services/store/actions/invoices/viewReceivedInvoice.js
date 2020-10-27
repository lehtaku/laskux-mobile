import {getRequest} from '../../../api/get';

export const VIEW_RECEIVED_INVOICE_REQUEST = 'VIEW_RECEIVED_INVOICE_REQUEST';
function viewReceivedInvoiceRequest() {
  return {
    type: VIEW_RECEIVED_INVOICE_REQUEST,
  };
}

export const VIEW_RECEIVED_INVOICE_SUCCESS = 'VIEW_RECEIVED_INVOICE_SUCCESS';
function viewReceivedInvoiceSuccess(data) {
  return {
    type: VIEW_RECEIVED_INVOICE_SUCCESS,
    payload: data,
  };
}

export const VIEW_RECEIVED_INVOICE_FAILURE = 'VIEW_RECEIVED_INVOICE_FAILURE';
function viewReceivedInvoiceFailure(error) {
  return {
    type: VIEW_RECEIVED_INVOICE_FAILURE,
    payload: error,
  };
}

export const VIEW_RECEIVED_INVOICE_RESET_STATE = 'VIEW_RECEIVED_INVOICE_RESET_STATE';
export function viewReceivedInvoiceResetState() {
  return {
    type: VIEW_RECEIVED_INVOICE_RESET_STATE,
  };
}

export function viewReceivedInvoice(token, invoiceId) {
  return async function (dispatch) {
    dispatch(viewReceivedInvoiceRequest());
    try {
      const pdf = await getRequest(`/received-invoices/${invoiceId}/pdf`, token);
      dispatch(viewReceivedInvoiceSuccess(pdf.file));
    } catch (error) {
      dispatch(viewReceivedInvoiceFailure(error));
    }
  };
}
