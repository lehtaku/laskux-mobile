import {
  MARK_AS_PAID_REQUEST,
  MARK_AS_PAID_SUCCESS,
  MARK_AS_PAID_FAILURE,
  MARK_AS_PAID_RESET_STATE,
} from '../../actions/invoices/markAsPaid';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const markAsPaidReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case MARK_AS_PAID_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case MARK_AS_PAID_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case MARK_AS_PAID_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case MARK_AS_PAID_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default markAsPaidReducer;
