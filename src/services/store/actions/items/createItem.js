import {postRequest} from '../../../api/post';

export const CREATE_ITEM_REQUEST = 'CREATE_ITEM_REQUEST';
function createItemRequest() {
  return {
    type: CREATE_ITEM_REQUEST,
  };
}

export const CREATE_ITEM_SUCCESS = 'CREATE_ITEM_SUCCESS';
function createItemSuccess(data) {
  return {
    type: CREATE_ITEM_SUCCESS,
    payload: data,
  };
}

export const CREATE_ITEM_FAILURE = 'CREATE_ITEM_FAILURE';
function createItemFailure(error) {
  return {
    type: CREATE_ITEM_FAILURE,
    payload: error,
  };
}

export const CREATE_ITEM_RESET_STATE = 'CREATE_ITEM_RESET_STATE';
export function createItemResetState() {
  return {
    type: CREATE_ITEM_RESET_STATE,
  };
}

export function createItem(token, data) {
  return async function (dispatch) {
    dispatch(createItemRequest());
    try {
      const item = await postRequest('/items', token, data);
      dispatch(createItemSuccess(item));
    } catch (error) {
      dispatch(createItemFailure(error));
    }
  };
}
