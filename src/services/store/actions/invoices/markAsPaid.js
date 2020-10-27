import {postRequest} from '../../../api/post';

export const MARK_AS_PAID_REQUEST = 'MARK_AS_PAID_REQUEST';
function markAsPaidRequest() {
  return {
    type: MARK_AS_PAID_REQUEST,
  };
}

export const MARK_AS_PAID_SUCCESS = 'MARK_AS_PAID_SUCCESS';
function markAsPaidSuccess() {
  return {
    type: MARK_AS_PAID_SUCCESS,
  };
}

export const MARK_AS_PAID_FAILURE = 'MARK_AS_PAID_FAILURE';
function markAsPaidFailure(error) {
  return {
    type: MARK_AS_PAID_FAILURE,
    payload: error,
  };
}

export const MARK_AS_PAID_RESET_STATE = 'MARK_AS_PAID_RESET_STATE';
export function markAsPaidResetState() {
  return {
    type: MARK_AS_PAID_RESET_STATE,
  };
}

export function markAsPaid(invoiceId, token, data) {
  return async function (dispatch) {
    dispatch(markAsPaidRequest());
    try {
      await postRequest(`/invoices/${invoiceId}/mark-as-paid`, token, data);
      dispatch(markAsPaidSuccess());
    } catch (error) {
      dispatch(markAsPaidFailure(error));
    }
  };
}
