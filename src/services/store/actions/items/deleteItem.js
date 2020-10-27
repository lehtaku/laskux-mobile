import {deleteRequest} from '../../../api/delete';

export const DELETE_ITEM_REQUEST = 'DELETE_ITEM_REQUEST';
function deleteItemRequest() {
  return {
    type: DELETE_ITEM_REQUEST,
  };
}

export const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS';
function deleteItemSuccess() {
  return {
    type: DELETE_ITEM_SUCCESS,
  };
}

export const DELETE_ITEM_FAILURE = 'DELETE_ITEM_FAILURE';
function deleteItemFailure(error) {
  return {
    type: DELETE_ITEM_FAILURE,
    payload: error,
  };
}

export const DELETE_ITEM_RESET_STATE = 'DELETE_ITEM_RESET_STATE';
export function deleteItemResetState() {
  return {
    type: DELETE_ITEM_RESET_STATE,
  };
}

export function deleteItem(itemId, token) {
  return async function (dispatch) {
    dispatch(deleteItemRequest());
    try {
      await deleteRequest(`/items/${itemId}`, token);
      dispatch(deleteItemSuccess());
    } catch (error) {
      dispatch(deleteItemFailure(error));
    }
  };
}
