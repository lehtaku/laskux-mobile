import {
  ADD_RECEIPT_REQUEST,
  ADD_RECEIPT_SUCCESS,
  ADD_RECEIPT_FAILURE,
  ADD_RECEIPT_RESET_STATE,
} from '../../actions/receipts/addReceipt';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  receipt: {
    id: null,
    description: null,
    type: null,
    total_gross_amount: null,
    total_vat_amount: null,
    total_net_amount: null,
    created_at: null,
    updated_at: null,
    state: null,
    rows: [],
    attachments: [],
  },
};

const addReceiptReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ADD_RECEIPT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case ADD_RECEIPT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, receipt: payload};
    case ADD_RECEIPT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case ADD_RECEIPT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default addReceiptReducer;
