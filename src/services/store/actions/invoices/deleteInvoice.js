import {deleteRequest} from '../../../api/delete';

export const DELETE_INVOICE_REQUEST = 'DELETE_INVOICE_REQUEST';
function deleteInvoiceRequest() {
  return {
    type: DELETE_INVOICE_REQUEST,
  };
}

export const DELETE_INVOICE_SUCCESS = 'DELETE_INVOICE_SUCCESS';
function deleteInvoiceSuccess() {
  return {
    type: DELETE_INVOICE_SUCCESS,
  };
}

export const DELETE_INVOICE_FAILURE = 'DELETE_INVOICE_FAILURE';
function deleteInvoiceFailure(error) {
  return {
    type: DELETE_INVOICE_FAILURE,
    payload: error,
  };
}

export const DELETE_INVOICE_RESET_STATE = 'DELETE_INVOICE_RESET_STATE';
export function deleteInvoiceResetState() {
  return {
    type: DELETE_INVOICE_RESET_STATE,
  };
}

export function deleteInvoice(invoiceId, token) {
  return async function (dispatch) {
    dispatch(deleteInvoiceRequest());
    try {
      await deleteRequest(`/invoices/${invoiceId}`, token);
      dispatch(deleteInvoiceSuccess());
    } catch (error) {
      dispatch(deleteInvoiceFailure(error));
    }
  };
}
