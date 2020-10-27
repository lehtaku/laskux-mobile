import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORIES_RESET_STATE,
} from '../../actions/items/fetchCategories';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  categories: [],
};

const fetchCategoriesReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_CATEGORIES_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_CATEGORIES_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, categories: payload};
    case FETCH_CATEGORIES_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_CATEGORIES_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchCategoriesReducer;
