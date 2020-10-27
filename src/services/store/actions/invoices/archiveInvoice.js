import {postRequest} from '../../../api/post';

export const ARCHIVE_INVOICE_REQUEST = 'ARCHIVE_INVOICE_REQUEST';
function archiveInvoiceRequest() {
  return {
    type: ARCHIVE_INVOICE_REQUEST,
  };
}

export const ARCHIVE_INVOICE_SUCCESS = 'ARCHIVE_INVOICE_SUCCESS';
function archiveInvoiceSuccess() {
  return {
    type: ARCHIVE_INVOICE_SUCCESS,
  };
}

export const ARCHIVE_INVOICE_FAILURE = 'ARCHIVE_INVOICE_FAILURE';
function archiveInvoiceFailure(error) {
  return {
    type: ARCHIVE_INVOICE_FAILURE,
    payload: error,
  };
}

export const ARCHIVE_INVOICE_RESET_STATE = 'ARCHIVE_INVOICE_RESET_STATE';
export function archiveInvoiceResetState() {
  return {
    type: ARCHIVE_INVOICE_RESET_STATE,
  };
}

export function archiveInvoice(invoiceId, token) {
  return async function (dispatch) {
    dispatch(archiveInvoiceRequest());
    try {
      await postRequest(`/invoices/${invoiceId}/archive`, token, null);
      dispatch(archiveInvoiceSuccess());
    } catch (error) {
      dispatch(archiveInvoiceFailure(error));
    }
  };
}
