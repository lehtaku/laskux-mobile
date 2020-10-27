import {patchRequest} from '../../../api/update';

export const EDIT_RECEIPT_REQUEST = 'EDIT_RECEIPT_REQUEST';
function editReceiptRequest() {
  return {
    type: EDIT_RECEIPT_REQUEST,
  };
}

export const EDIT_RECEIPT_SUCCESS = 'EDIT_RECEIPT_SUCCESS';
function editReceiptSuccess() {
  return {
    type: EDIT_RECEIPT_SUCCESS,
  };
}

export const EDIT_RECEIPT_FAILURE = 'EDIT_RECEIPT_FAILURE';
function editReceiptFailure(error) {
  return {
    type: EDIT_RECEIPT_FAILURE,
    payload: error,
  };
}

export const EDIT_RECEIPT_RESET_STATE = 'EDIT_RECEIPT_RESET_STATE';
export function editReceiptResetState() {
  return {
    type: EDIT_RECEIPT_RESET_STATE,
  };
}

export function editReceipt(receiptId, token, data) {
  return async function (dispatch) {
    dispatch(editReceiptRequest());
    try {
      await patchRequest(`/receipts/${receiptId}`, token, data);
      dispatch(editReceiptSuccess());
    } catch (error) {
      dispatch(editReceiptFailure(error));
    }
  };
}
