import {
  FETCH_ITEM_UNITS_REQUEST,
  FETCH_ITEM_UNITS_SUCCESS,
  FETCH_ITEM_UNITS_FAILURE,
} from '../../actions/items/fetchItemUnits';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  units: [],
};

const fetchItemUnitsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_ITEM_UNITS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_ITEM_UNITS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, units: payload};
    case FETCH_ITEM_UNITS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    default:
      return state;
  }
};

export default fetchItemUnitsReducer;
