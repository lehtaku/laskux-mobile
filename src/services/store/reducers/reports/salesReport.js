import {
  SALES_REPORT_REQUEST,
  SALES_REPORT_SUCCESS,
  SALES_REPORT_FAILURE,
  SALES_REPORT_RESET_STATE,
} from '../../actions/reports/salesReport';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  rows: [],
  summary: [],
};

export const salesReportReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SALES_REPORT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SALES_REPORT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case SALES_REPORT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SALES_REPORT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default salesReportReducer;
