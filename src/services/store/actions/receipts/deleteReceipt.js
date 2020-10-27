import {deleteRequest} from '../../../api/delete';

export const DELETE_RECEIPT_REQUEST = 'DELETE_RECEIPT_REQUEST';
function deleteReceiptRequest() {
  return {
    type: DELETE_RECEIPT_REQUEST,
  };
}

export const DELETE_RECEIPT_SUCCESS = 'DELETE_RECEIPT_SUCCESS';
function deleteReceiptSuccess() {
  return {
    type: DELETE_RECEIPT_SUCCESS,
  };
}

export const DELETE_RECEIPT_FAILURE = 'DELETE_RECEIPT_FAILURE';
function deleteReceiptFailure(error) {
  return {
    type: DELETE_RECEIPT_FAILURE,
    payload: error,
  };
}

export const DELETE_RECEIPT_RESET_STATE = 'DELETE_RECEIPT_RESET_STATE';
export function deleteReceiptResetState() {
  return {
    type: DELETE_RECEIPT_RESET_STATE,
  };
}

export function deleteReceipt(receiptId, token) {
  return async function (dispatch) {
    dispatch(deleteReceiptRequest());
    try {
      await deleteRequest(`/receipts/${receiptId}`, token);
      dispatch(deleteReceiptSuccess());
    } catch (error) {
      dispatch(deleteReceiptFailure(error));
    }
  };
}
