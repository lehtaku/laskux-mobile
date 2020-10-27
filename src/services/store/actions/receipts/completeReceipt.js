import {patchRequest} from '../../../api/update';

export const COMPLETE_RECEIPT_REQUEST = 'COMPLETE_RECEIPT_REQUEST';
function completeReceiptRequest() {
  return {
    type: COMPLETE_RECEIPT_REQUEST,
  };
}

export const COMPLETE_RECEIPT_SUCCESS = 'COMPLETE_RECEIPT_SUCCESS';
function completeReceiptSuccess() {
  return {
    type: COMPLETE_RECEIPT_SUCCESS,
  };
}

export const COMPLETE_RECEIPT_FAILURE = 'COMPLETE_RECEIPT_FAILURE';
function completeReceiptFailure(error) {
  return {
    type: COMPLETE_RECEIPT_FAILURE,
    payload: error,
  };
}

export const COMPLETE_RECEIPT_RESET_STATE = 'COMPLETE_RECEIPT_RESET_STATE';
export function completeReceiptResetState() {
  return {
    type: COMPLETE_RECEIPT_RESET_STATE,
  };
}

export function completeReceipt(receiptId, token, data) {
  return async function (dispatch) {
    dispatch(completeReceiptRequest());
    try {
      await patchRequest(`/receipts/${receiptId}`, token, data);
      dispatch(completeReceiptSuccess());
    } catch (error) {
      dispatch(completeReceiptFailure(error));
    }
  };
}
