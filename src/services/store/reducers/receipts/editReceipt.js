import {
  EDIT_RECEIPT_REQUEST,
  EDIT_RECEIPT_SUCCESS,
  EDIT_RECEIPT_FAILURE,
  EDIT_RECEIPT_RESET_STATE,
} from '../../actions/receipts/editReceipt';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const editReceiptReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case EDIT_RECEIPT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case EDIT_RECEIPT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case EDIT_RECEIPT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case EDIT_RECEIPT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default editReceiptReducer;
