import {
  COMPLETE_RECEIPT_REQUEST,
  COMPLETE_RECEIPT_SUCCESS,
  COMPLETE_RECEIPT_FAILURE,
  COMPLETE_RECEIPT_RESET_STATE,
} from '../../actions/receipts/completeReceipt';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const completeReceiptReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case COMPLETE_RECEIPT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case COMPLETE_RECEIPT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case COMPLETE_RECEIPT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case COMPLETE_RECEIPT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default completeReceiptReducer;
