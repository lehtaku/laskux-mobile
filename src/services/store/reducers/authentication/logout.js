import {
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_RESET_STATE,
} from '../../actions/authentication/logout';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const logoutReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case LOGOUT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case LOGOUT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case LOGOUT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case LOGOUT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default logoutReducer;
