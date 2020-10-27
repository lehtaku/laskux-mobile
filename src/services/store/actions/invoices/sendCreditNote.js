import {postRequest} from '../../../api/post';

export const SEND_CREDIT_NOTE_REQUEST = 'SEND_CREDIT_NOTE_REQUEST';
function sendCreditNoteRequest() {
  return {
    type: SEND_CREDIT_NOTE_REQUEST,
  };
}

export const SEND_CREDIT_NOTE_SUCCESS = 'SEND_CREDIT_NOTE_SUCCESS';
function sendCreditNoteSuccess() {
  return {
    type: SEND_CREDIT_NOTE_SUCCESS,
  };
}

export const SEND_CREDIT_NOTE_FAILURE = 'SEND_CREDIT_NOTE_FAILURE';
function sendCreditNoteFailure(error) {
  return {
    type: SEND_CREDIT_NOTE_FAILURE,
    payload: error,
  };
}

export const SEND_CREDIT_NOTE_RESET_STATE = 'SEND_CREDIT_NOTE_RESET_STATE';
export function sendCreditNoteResetState() {
  return {
    type: SEND_CREDIT_NOTE_RESET_STATE,
  };
}

export function sendCreditNote(invoiceId, token, data) {
  return async function (dispatch) {
    dispatch(sendCreditNoteRequest());
    try {
      await postRequest(`/invoices/${invoiceId}/send-credit-note`, token, data);
      dispatch(sendCreditNoteSuccess());
    } catch (error) {
      dispatch(sendCreditNoteFailure(error));
    }
  };
}
