import {getRequest} from '../../../api/get';

export const FETCH_ITEMS_REQUEST = 'FETCH_ITEMS_REQUEST';
function fetchItemsRequest() {
  return {
    type: FETCH_ITEMS_REQUEST,
  };
}

export const FETCH_ITEMS_REFRESH = 'FETCH_ITEMS_REFRESH';
function fetchItemsRefresh() {
  return {
    type: FETCH_ITEMS_REFRESH,
  };
}

export const FETCH_ITEMS_SUCCESS = 'FETCH_ITEMS_SUCCESS';
function fetchItemsSuccess(data) {
  return {
    type: FETCH_ITEMS_SUCCESS,
    payload: data,
  };
}

export const FETCH_ITEMS_FAILURE = 'FETCH_ITEMS_FAILURE';
function fetchItemsFailure(error) {
  return {
    type: FETCH_ITEMS_FAILURE,
    payload: error,
  };
}

export const FETCH_ITEMS_RESET_STATE = 'FETCH_ITEMS_RESET_STATE';
export function fetchItemsResetState() {
  return {
    type: FETCH_ITEMS_RESET_STATE,
  };
}

export function fetchItems(path, token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchItemsRefresh());
    } else {
      dispatch(fetchItemsRequest());
    }
    try {
      const items = await getRequest(path, token);
      dispatch(fetchItemsSuccess(items));
    } catch (error) {
      dispatch(fetchItemsFailure(error));
    }
  };
}
