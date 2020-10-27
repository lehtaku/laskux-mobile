import {
  SALES_BY_ITEM_REQUEST,
  SALES_BY_ITEM_SUCCESS,
  SALES_BY_ITEM_FAILURE,
  SALES_BY_ITEM_RESET_STATE,
} from '../../actions/reports/salesByItem';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  rows: [],
  summary: [],
};

export const salesByItemReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SALES_BY_ITEM_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SALES_BY_ITEM_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case SALES_BY_ITEM_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SALES_BY_ITEM_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default salesByItemReducer;
