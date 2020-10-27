import {
  DELETE_RECEIPT_REQUEST,
  DELETE_RECEIPT_SUCCESS,
  DELETE_RECEIPT_FAILURE,
  DELETE_RECEIPT_RESET_STATE,
} from '../../actions/receipts/deleteReceipt';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const deleteReceiptReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case DELETE_RECEIPT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case DELETE_RECEIPT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case DELETE_RECEIPT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case DELETE_RECEIPT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default deleteReceiptReducer;
