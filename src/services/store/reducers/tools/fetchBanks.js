import {
  FETCH_BANKS_REQUEST,
  FETCH_BANKS_SUCCESS,
  FETCH_BANKS_FAILURE,
  FETCH_BANKS_RESET_STATE,
} from '../../actions/tools/fetchBanks';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  banks: [],
};

const fetchBanksReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_BANKS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_BANKS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, banks: payload};
    case FETCH_BANKS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_BANKS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchBanksReducer;
