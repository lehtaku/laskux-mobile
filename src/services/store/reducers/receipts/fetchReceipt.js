import {
  FETCH_RECEIPT_REQUEST,
  FETCH_RECEIPT_SUCCESS,
  FETCH_RECEIPT_FAILURE,
  FETCH_RECEIPT_RESET_STATE,
} from '../../actions/receipts/fetchReceipt';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  receipt: {
    id: null,
    payment_method_id: null,
    profit_and_loss_account_id: null,
    seller_id: null,
    receipt_date: null,
    description: null,
    type: null,
    total_gross_amount: null,
    total_net_amount: null,
    created_at: null,
    updated_at: null,
    state: null,
  },
};

const fetchReceiptReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_RECEIPT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_RECEIPT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, receipt: payload};
    case FETCH_RECEIPT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_RECEIPT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchReceiptReducer;
