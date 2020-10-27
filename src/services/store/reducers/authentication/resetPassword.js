import {
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  REST_PASSWORD_FAILURE,
  RESET_PASSWORD_RESET_STATE,
} from '../../actions/authentication/resetPassword';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const resetPasswordReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case RESET_PASSWORD_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case RESET_PASSWORD_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case REST_PASSWORD_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case RESET_PASSWORD_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default resetPasswordReducer;
