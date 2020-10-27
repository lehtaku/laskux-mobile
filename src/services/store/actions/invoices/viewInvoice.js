import {getRequest} from '../../../api/get';

export const VIEW_INVOICE_REQUEST = 'VIEW_INVOICE_REQUEST';
function viewInvoiceRequest() {
  return {
    type: VIEW_INVOICE_REQUEST,
  };
}

export const VIEW_INVOICE_SUCCESS = 'VIEW_INVOICE_SUCCESS';
function viewInvoiceSuccess(data) {
  return {
    type: VIEW_INVOICE_SUCCESS,
    payload: data,
  };
}

export const VIEW_INVOICE_FAILURE = 'VIEW_INVOICE_FAILURE';
function viewInvoiceFailure(error) {
  return {
    type: VIEW_INVOICE_FAILURE,
    payload: error,
  };
}

export const VIEW_INVOICE_RESET_STATE = 'VIEW_INVOICE_RESET_STATE';
export function viewInvoiceResetState() {
  return {
    type: VIEW_INVOICE_RESET_STATE,
  };
}

export function viewInvoice(token, invoiceId) {
  return async function (dispatch) {
    dispatch(viewInvoiceRequest());
    try {
      const pdf = await getRequest(`/invoice/${invoiceId}/pdf`, token);
      dispatch(viewInvoiceSuccess(pdf.file));
    } catch (error) {
      dispatch(viewInvoiceFailure(error));
    }
  };
}
