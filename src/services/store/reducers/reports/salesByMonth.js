import {
  SALES_BY_MONTH_REQUEST,
  SALES_BY_MONTH_SUCCESS,
  SALES_BY_MONTH_FAILURE,
  SALES_BY_MONTH_RESET_STATE,
} from '../../actions/reports/salesByMonth';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  rows: [],
  summary: [],
};

const salesByMonthReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SALES_BY_MONTH_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SALES_BY_MONTH_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case SALES_BY_MONTH_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SALES_BY_MONTH_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default salesByMonthReducer;
