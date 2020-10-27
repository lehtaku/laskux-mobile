import {
  FETCH_RECEIPTS_REQUEST,
  FETCH_RECEIPTS_REFRESH,
  FETCH_RECEIPTS_SUCCESS,
  FETCH_RECEIPTS_FAILURE,
  FETCH_RECEIPTS_RESET_STATE,
} from '../../actions/receipts/fetchReceipts';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  receipts: [],
};

const fetchReceiptsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_RECEIPTS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_RECEIPTS_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_RECEIPTS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, receipts: payload};
    case FETCH_RECEIPTS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_RECEIPTS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchReceiptsReducer;
