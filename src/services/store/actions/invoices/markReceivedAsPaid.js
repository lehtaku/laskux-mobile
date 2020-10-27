import {postRequest} from '../../../api/post';

export const MARK_RECEIVED_AS_PAID_REQUEST = 'MARK_RECEIVED_AS_PAID_REQUEST';
function markReceivedAsPaidRequest() {
  return {
    type: MARK_RECEIVED_AS_PAID_REQUEST,
  };
}

export const MARK_RECEIVED_AS_PAID_SUCCESS = 'MARK_RECEIVED_AS_PAID_SUCCESS';
function markReceivedAsPaidSuccess() {
  return {
    type: MARK_RECEIVED_AS_PAID_SUCCESS,
  };
}

export const MARK_RECEIVED_AS_PAID_FAILURE = 'MARK_RECEIVED_AS_PAID_FAILURE';
function markReceivedAsPaidFailure(error) {
  return {
    type: MARK_RECEIVED_AS_PAID_FAILURE,
    payload: error,
  };
}

export const MARK_RECEIVED_AS_PAID_RESET_STATE = 'MARK_RECEIVED_AS_PAID_RESET_STATE';
export function markReceivedAsPaidResetState() {
  return {
    type: MARK_RECEIVED_AS_PAID_RESET_STATE,
  };
}

export function markReceivedAsPaid(invoiceId, token, data) {
  return async function (dispatch) {
    dispatch(markReceivedAsPaidRequest());
    try {
      await postRequest(`/received-invoices/${invoiceId}/mark-as-paid`, token, data);
      dispatch(markReceivedAsPaidSuccess());
    } catch (error) {
      dispatch(markReceivedAsPaidFailure(error));
    }
  };
}
