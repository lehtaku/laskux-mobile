import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_RESET_STATE,
} from '../../actions/authentication/login';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  accounts: [],
};

const loginReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case LOGIN_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case LOGIN_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, accounts: payload};
    case LOGIN_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case LOGIN_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default loginReducer;
