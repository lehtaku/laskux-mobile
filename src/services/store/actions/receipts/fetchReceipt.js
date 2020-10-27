import {getRequest} from '../../../api/get';

export const FETCH_RECEIPT_REQUEST = 'FETCH_RECEIPT_REQUEST';
function fetchReceiptRequest() {
  return {
    type: FETCH_RECEIPT_REQUEST,
  };
}

export const FETCH_RECEIPT_SUCCESS = 'FETCH_RECEIPT_SUCCESS';
function fetchReceiptSuccess(data) {
  return {
    type: FETCH_RECEIPT_SUCCESS,
    payload: data,
  };
}

export const FETCH_RECEIPT_FAILURE = 'FETCH_RECEIPT_FAILURE';
function fetchReceiptFailure(error) {
  return {
    type: FETCH_RECEIPT_FAILURE,
    payload: error,
  };
}

export const FETCH_RECEIPT_RESET_STATE = 'FETCH_RECEIPT_RESET_STATE';
export function fetchReceiptResetState() {
  return {
    type: FETCH_RECEIPT_RESET_STATE,
  };
}

export function fetchReceipt(receiptId, token) {
  return async function (dispatch) {
    dispatch(fetchReceiptRequest());
    try {
      const receipt = await getRequest(`/receipts/${receiptId}`, token);
      dispatch(fetchReceiptSuccess(receipt));
    } catch (error) {
      dispatch(fetchReceiptFailure(error));
    }
  };
}
