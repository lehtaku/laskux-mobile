import {postRequest} from '../../../api/post';

export const SEND_INVOICE_REMINDER_REQUEST = 'SEND_INVOICE_REMINDER_REQUEST';
function sendInvoiceReminderRequest() {
  return {
    type: SEND_INVOICE_REMINDER_REQUEST,
  };
}

export const SEND_INVOICE_REMINDER_SUCCESS = 'SEND_INVOICE_REMINDER_SUCCESS';
function sendInvoiceReminderSuccess() {
  return {
    type: SEND_INVOICE_REMINDER_SUCCESS,
  };
}

export const SEND_INVOICE_REMINDER_FAILURE = 'SEND_INVOICE_REMINDER_FAILURE';
function sendInvoiceReminderFailure(error) {
  return {
    type: SEND_INVOICE_REMINDER_FAILURE,
    payload: error,
  };
}

export const SEND_INVOICE_REMINDER_RESET_STATE = 'SEND_INVOICE_REMINDER_RESET_STATE';
export function sendInvoiceReminderResetState() {
  return {
    type: SEND_INVOICE_REMINDER_RESET_STATE,
  };
}

export function sendInvoiceReminder(invoiceId, token, data) {
  return async function (dispatch) {
    dispatch(sendInvoiceReminderRequest());
    try {
      await postRequest(`/invoices/${invoiceId}/send-reminder`, token, data);
      dispatch(sendInvoiceReminderSuccess());
    } catch (error) {
      dispatch(sendInvoiceReminderFailure(error));
    }
  };
}
