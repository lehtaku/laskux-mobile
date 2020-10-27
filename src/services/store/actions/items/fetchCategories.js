import {getRequest} from '../../../api/get';

export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
function fetchCategoriesRequest() {
  return {
    type: FETCH_CATEGORIES_REQUEST,
  };
}

export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
function fetchCategoriesSuccess(data) {
  return {
    type: FETCH_CATEGORIES_SUCCESS,
    payload: data,
  };
}

export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';
function fetchCategoriesFailure(error) {
  return {
    type: FETCH_CATEGORIES_FAILURE,
    payload: error,
  };
}

export const FETCH_CATEGORIES_RESET_STATE = 'FETCH_CATEGORIES_RESET_STATE';
export function fetchCategoriesResetState() {
  return {
    type: FETCH_CATEGORIES_RESET_STATE,
  };
}

export function fetchCategories(token) {
  return async function (dispatch) {
    dispatch(fetchCategoriesRequest());
    try {
      const categories = await getRequest('/categories', token);
      dispatch(fetchCategoriesSuccess(categories));
    } catch (error) {
      dispatch(fetchCategoriesFailure(error));
    }
  };
}
