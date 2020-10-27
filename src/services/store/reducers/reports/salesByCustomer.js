import {
  SALES_BY_CUSTOMER_REQUEST,
  SALES_BY_CUSTOMER_SUCCESS,
  SALES_BY_CUSTOMER_FAILURE,
  SALES_BY_CUSTOMER_RESET_STATE,
} from '../../actions/reports/salesByCustomer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  rows: [],
  summary: [],
};

export const salesByCustomerReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SALES_BY_CUSTOMER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SALES_BY_CUSTOMER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case SALES_BY_CUSTOMER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SALES_BY_CUSTOMER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default salesByCustomerReducer;
