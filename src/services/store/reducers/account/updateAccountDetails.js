import {
  UPDATE_ACCOUNT_DETAILS_REQUEST,
  UPDATE_ACCOUNT_DETAILS_SUCCESS,
  UPDATE_ACCOUNT_DETAILS_FAILURE,
  UPDATE_ACCOUNT_DETAILS_RESET_STATE,
} from '../../actions/account/updateAccountDetails';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const updateAccountDetailsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_ACCOUNT_DETAILS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case UPDATE_ACCOUNT_DETAILS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case UPDATE_ACCOUNT_DETAILS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case UPDATE_ACCOUNT_DETAILS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default updateAccountDetailsReducer;
