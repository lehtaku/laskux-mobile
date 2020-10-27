import {patchRequest} from '../../../api/update';
import {postRequest} from '../../../api/post';

export const EDIT_INVOICE_PREVIEW_REQUEST = 'EDIT_INVOICE_PREVIEW_REQUEST';
function editInvoicePreviewRequest() {
  return {
    type: EDIT_INVOICE_PREVIEW_REQUEST,
  };
}

export const EDIT_INVOICE_PREVIEW_SUCCESS = 'EDIT_INVOICE_PREVIEW_SUCCESS';
function editInvoicePreviewSuccess(data) {
  return {
    type: EDIT_INVOICE_PREVIEW_SUCCESS,
    payload: data,
  };
}

export const EDIT_INVOICE_PREVIEW_FAILURE = 'EDIT_INVOICE_PREVIEW_FAILURE';
function editInvoicePreviewFailure(error) {
  return {
    type: EDIT_INVOICE_PREVIEW_FAILURE,
    payload: error,
  };
}

export const EDIT_INVOICE_SEND_REQUEST = 'EDIT_INVOICE_SEND_REQUEST';
function editInvoiceSendRequest() {
  return {
    type: EDIT_INVOICE_SEND_REQUEST,
  };
}

export const EDIT_INVOICE_SEND_SUCCESS = 'EDIT_INVOICE_SEND_SUCCESS';
function editInvoiceSendSuccess() {
  return {
    type: EDIT_INVOICE_SEND_SUCCESS,
  };
}

export const EDIT_INVOICE_SEND_FAILURE = 'EDIT_INVOICE_SEND_FAILURE';
function editInvoiceSendFailure(error) {
  return {
    type: EDIT_INVOICE_SEND_FAILURE,
    payload: error,
  };
}

export const EDIT_INVOICE_REQUEST = 'EDIT_INVOICE_REQUEST';
function editInvoiceRequest() {
  return {
    type: EDIT_INVOICE_REQUEST,
  };
}

export const EDIT_INVOICE_SUCCESS = 'EDIT_INVOICE_SUCCESS';
function editInvoiceSuccess() {
  return {
    type: EDIT_INVOICE_SUCCESS,
  };
}

export const EDIT_INVOICE_FAILURE = 'EDIT_INVOICE_FAILURE';
function editInvoiceFailure(error) {
  return {
    type: EDIT_INVOICE_FAILURE,
    payload: error,
  };
}

export const EDIT_INVOICE_RESET_STATE = 'EDIT_INVOICE_RESET_STATE';
export function editInvoiceResetState() {
  return {
    type: EDIT_INVOICE_RESET_STATE,
  };
}

export function editInvoice(invoiceId, token, data) {
  return async function (dispatch) {
    const send = data.send;
    if (send) {
      dispatch(editInvoiceSendRequest());
    } else {
      dispatch(editInvoiceRequest());
    }
    try {
      await patchRequest(`/invoices/${invoiceId}`, token, data);
      if (send) {
        dispatch(editInvoiceSendSuccess());
      } else {
        dispatch(editInvoiceSuccess());
      }
    } catch (error) {
      if (send) {
        dispatch(editInvoiceSendFailure(error));
      } else {
        dispatch(editInvoiceFailure(error));
      }
    }
  };
}

export function editInvoicePreview(token, data) {
  return async function (dispatch) {
    dispatch(editInvoicePreviewRequest());
    try {
      const pdf = await postRequest('/invoice-previews', token, {...data, return_file: true});
      dispatch(editInvoicePreviewSuccess(pdf.file));
    } catch (error) {
      dispatch(editInvoicePreviewFailure(error));
    }
  };
}
