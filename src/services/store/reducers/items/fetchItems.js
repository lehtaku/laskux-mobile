import {
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_REFRESH,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_RESET_STATE,
} from '../../actions/items/fetchItems';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  items: [],
};

const fetchItemsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_ITEMS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_ITEMS_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_ITEMS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, items: payload};
    case FETCH_ITEMS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_ITEMS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchItemsReducer;
