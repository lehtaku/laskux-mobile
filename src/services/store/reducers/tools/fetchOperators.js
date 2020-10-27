import {
  FETCH_OPERATORS_REQUEST,
  FETCH_OPERATORS_SUCCESS,
  FETCH_OPERATORS_FAILURE,
  FETCH_OPERATORS_RESET_STATE,
} from '../../actions/tools/fetchOperators';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  operators: [],
};

const fetchOperatorsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_OPERATORS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_OPERATORS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, operators: payload};
    case FETCH_OPERATORS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_OPERATORS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchOperatorsReducer;
