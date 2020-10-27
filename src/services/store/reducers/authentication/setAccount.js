import {
  SET_ACCOUNT_REQUEST,
  SET_ACCOUNT_SUCCESS,
  SET_ACCOUNT_FAILURE,
  SET_ACCOUNT_RESET_STATE,
} from '../../actions/authentication/setAccount';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const setAccountReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_ACCOUNT_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SET_ACCOUNT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case SET_ACCOUNT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SET_ACCOUNT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default setAccountReducer;
