import {getRequest} from '../../../api/get';

export const FETCH_ITEM_REQUEST = 'FETCH_ITEM_REQUEST';
function fetchItemRequest() {
  return {
    type: FETCH_ITEM_REQUEST,
  };
}

export const FETCH_ITEM_SUCCESS = 'FETCH_ITEM_SUCCESS';
function fetchItemSuccess(data) {
  return {
    type: FETCH_ITEM_SUCCESS,
    payload: data,
  };
}

export const FETCH_ITEM_FAILURE = 'FETCH_ITEM_FAILURE';
function fetchItemFailure(error) {
  return {
    type: FETCH_ITEM_FAILURE,
    payload: error,
  };
}

export const FETCH_ITEM_RESET_STATE = 'FETCH_ITEM_RESET_STATE';
export function fetchItemResetState() {
  return {
    type: FETCH_ITEM_RESET_STATE,
  };
}

export function fetchItem(token, itemId) {
  return async function (dispatch) {
    dispatch(fetchItemRequest());
    try {
      const item = await getRequest(`/items/${itemId}`, token);
      dispatch(fetchItemSuccess(item));
    } catch (error) {
      dispatch(fetchItemFailure(error));
    }
  };
}
