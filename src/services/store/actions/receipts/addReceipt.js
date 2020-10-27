import {postRequest} from '../../../api/post';

export const ADD_RECEIPT_REQUEST = 'ADD_RECEIPT_REQUEST';
function addReceiptRequest() {
  return {
    type: ADD_RECEIPT_REQUEST,
  };
}

export const ADD_RECEIPT_SUCCESS = 'ADD_RECEIPT_SUCCESS';
function addReceiptSuccess(data) {
  return {
    type: ADD_RECEIPT_SUCCESS,
    payload: data,
  };
}

export const ADD_RECEIPT_FAILURE = 'ADD_RECEIPT_FAILURE';
function addReceiptFailure(error) {
  return {
    type: ADD_RECEIPT_FAILURE,
    payload: error,
  };
}

export const ADD_RECEIPT_RESET_STATE = 'ADD_RECEIPT_RESET_STATE';
export function addReceiptResetState() {
  return {
    type: ADD_RECEIPT_RESET_STATE,
  };
}

export function addReceipt(token, data) {
  return async function (dispatch) {
    dispatch(addReceiptRequest());
    try {
      const receipt = await postRequest('/receipts', token, data);
      dispatch(addReceiptSuccess(receipt));
    } catch (error) {
      dispatch(addReceiptFailure(error));
    }
  };
}
