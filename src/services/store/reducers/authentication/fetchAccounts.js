import {
  FETCH_ACCOUNTS_REQUEST,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_FAILURE,
  FETCH_ACCOUNTS_RESET_STATE,
} from '../../actions/authentication/fetchAccounts';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  accounts: [],
};

const fetchAccountsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_ACCOUNTS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_ACCOUNTS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, accounts: payload};
    case FETCH_ACCOUNTS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_ACCOUNTS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchAccountsReducer;
