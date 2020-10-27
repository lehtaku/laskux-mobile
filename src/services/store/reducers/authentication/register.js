import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_RESET_STATE,
} from '../../actions/authentication/register';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const registerReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case REGISTER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case REGISTER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case REGISTER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case REGISTER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default registerReducer;
