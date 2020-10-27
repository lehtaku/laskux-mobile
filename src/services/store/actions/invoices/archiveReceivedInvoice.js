import {postRequest} from '../../../api/post';

export const ARCHIVE_RECEIVED_INVOICE_REQUEST = 'ARCHIVE_RECEIVED_INVOICE_REQUEST';
function archiveReceivedInvoiceRequest() {
  return {
    type: ARCHIVE_RECEIVED_INVOICE_REQUEST,
  };
}

export const ARCHIVE_RECEIVED_INVOICE_SUCCESS = 'ARCHIVE_RECEIVED_INVOICE_SUCCESS';
function archiveReceivedInvoiceSuccess() {
  return {
    type: ARCHIVE_RECEIVED_INVOICE_SUCCESS,
  };
}

export const ARCHIVE_RECEIVED_INVOICE_FAILURE = 'ARCHIVE_RECEIVED_INVOICE_FAILURE';
function archiveReceivedInvoiceFailure(error) {
  return {
    type: ARCHIVE_RECEIVED_INVOICE_FAILURE,
    payload: error,
  };
}

export const ARCHIVE_RECEIVED_INVOICE_RESET_STATE = 'ARCHIVE_RECEIVED_INVOICE_RESET_STATE';
export function archiveReceivedInvoiceResetState() {
  return {
    type: ARCHIVE_RECEIVED_INVOICE_RESET_STATE,
  };
}

export function archiveReceivedInvoice(invoiceId, token) {
  return async function (dispatch) {
    dispatch(archiveReceivedInvoiceRequest());
    try {
      await postRequest(`/received-invoices/${invoiceId}/archive`, token, null);
      dispatch(archiveReceivedInvoiceSuccess());
    } catch (error) {
      dispatch(archiveReceivedInvoiceFailure(error));
    }
  };
}
