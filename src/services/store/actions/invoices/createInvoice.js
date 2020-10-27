import {postRequest} from '../../../api/post';

export const CREATE_INVOICE_PREVIEW_REQUEST = 'CREATE_INVOICE_PREVIEW_REQUEST';
function createInvoicePreviewRequest() {
  return {
    type: CREATE_INVOICE_PREVIEW_REQUEST,
  };
}

export const CREATE_INVOICE_PREVIEW_SUCCESS = 'CREATE_INVOICE_PREVIEW_SUCCESS';
function createInvoicePreviewSuccess(data) {
  return {
    type: CREATE_INVOICE_PREVIEW_SUCCESS,
    payload: data,
  };
}

export const CREATE_INVOICE_PREVIEW_FAILURE = 'CREATE_INVOICE_PREVIEW_FAILURE';
function createInvoicePreviewFailure(error) {
  return {
    type: CREATE_INVOICE_PREVIEW_FAILURE,
    payload: error,
  };
}

export const CREATE_INVOICE_REQUEST = 'CREATE_INVOICE_REQUEST';
function createInvoiceRequest() {
  return {
    type: CREATE_INVOICE_REQUEST,
  };
}

export const CREATE_INVOICE_SEND_REQUEST = 'CREATE_INVOICE_SEND_REQUEST';
function createInvoiceSendRequest() {
  return {
    type: CREATE_INVOICE_SEND_REQUEST,
  };
}

export const CREATE_INVOICE_SEND_SUCCESS = 'CREATE_INVOICE_SEND_SUCCESS';
function createInvoiceSendSuccess() {
  return {
    type: CREATE_INVOICE_SEND_SUCCESS,
  };
}

export const CREATE_INVOICE_SEND_FAILURE = 'CREATE_INVOICE_SEND_FAILURE';
function createInvoiceSendFailure(error) {
  return {
    type: CREATE_INVOICE_SEND_FAILURE,
    payload: error,
  };
}

export const CREATE_INVOICE_SUCCESS = 'CREATE_INVOICE_SUCCESS';
function createInvoiceSuccess() {
  return {
    type: CREATE_INVOICE_SUCCESS,
  };
}

export const CREATE_INVOICE_FAILURE = 'CREATE_INVOICE_FAILURE';
function createInvoiceFailure(error) {
  return {
    type: CREATE_INVOICE_FAILURE,
    payload: error,
  };
}

export const CREATE_INVOICE_RESET_STATE = 'CREATE_INVOICE_RESET_STATE';
export function createInvoiceResetState() {
  return {
    type: CREATE_INVOICE_RESET_STATE,
  };
}

export function createInvoice(token, data) {
  return async function (dispatch) {
    const send = data.send;
    if (send) {
      dispatch(createInvoiceSendRequest());
    } else {
      dispatch(createInvoiceRequest());
    }
    try {
      await postRequest('/invoices', token, data);
      if (send) {
        dispatch(createInvoiceSendSuccess());
      } else {
        dispatch(createInvoiceSuccess());
      }
    } catch (error) {
      if (send) {
        dispatch(createInvoiceSendFailure(error));
      } else {
        dispatch(createInvoiceFailure(error));
      }
    }
  };
}

export function createInvoicePreview(token, data) {
  return async function (dispatch) {
    dispatch(createInvoicePreviewRequest());
    try {
      const pdf = await postRequest('/invoice-previews', token, {...data, return_file: true});
      dispatch(createInvoicePreviewSuccess(pdf.file));
    } catch (error) {
      dispatch(createInvoicePreviewFailure(error));
    }
  };
}
