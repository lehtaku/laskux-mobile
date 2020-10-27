import {
  FETCH_SELLERS_REQUEST,
  FETCH_SELLERS_SUCCESS,
  FETCH_SELLERS_FAILURE,
  FETCH_SELLERS_RESET_STATE,
} from '../../actions/sellers/fetchSellers';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  sellers: [],
};

const fetchSellersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_SELLERS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_SELLERS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, sellers: payload};
    case FETCH_SELLERS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_SELLERS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchSellersReducer;
