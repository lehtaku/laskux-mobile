import {
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_REQUEST,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_RESET_STATE,
} from '../../actions/items/fetchItem';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  item: {
    id: null,
    name: null,
    unit: null,
    price: null,
    vat_percent: null,
    price_with_vat: null,
    categories: [],
  },
};

const fetchItemReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_ITEM_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_ITEM_SUCCESS:
      return {
        ...state,
        state: RequestStates.SUCCESS,
        item: {...initialState.item, ...payload},
      };
    case FETCH_ITEM_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_ITEM_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchItemReducer;
