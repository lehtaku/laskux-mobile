import {
  FETCH_ACCOUNT_REQUEST,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_FAILURE,
  FETCH_ACCOUNT_RESET_STATE,
} from '../../actions/authentication/fetchAccount';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,

  account_id: null,
  account_name: null,
  user_id: null,
  token: null,
};

const fetchAccountReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_ACCOUNT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_ACCOUNT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case FETCH_ACCOUNT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_ACCOUNT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchAccountReducer;
