import {patchRequest} from '../../../api/update';

export const EDIT_ITEM_REQUEST = 'EDIT_ITEM_REQUEST';
function editItemRequest() {
  return {
    type: EDIT_ITEM_REQUEST,
  };
}

export const EDIT_ITEM_SUCCESS = 'EDIT_ITEM_SUCCESS';
function editItemSuccess(data) {
  return {
    type: EDIT_ITEM_SUCCESS,
    payload: data,
  };
}

export const EDIT_ITEM_FAILURE = 'EDIT_ITEM_FAILURE';
function editItemFailure(error) {
  return {
    type: EDIT_ITEM_FAILURE,
    payload: error,
  };
}

export const EDIT_ITEM_RESET_STATE = 'EDIT_ITEM_RESET_STATE';
export function editItemResetState() {
  return {
    type: EDIT_ITEM_RESET_STATE,
  };
}

export function editItem(itemId, token, data) {
  return async function (dispatch) {
    dispatch(editItemRequest());
    try {
      const item = await patchRequest(`/items/${itemId}`, token, data);
      dispatch(editItemSuccess(item));
    } catch (error) {
      dispatch(editItemFailure(error));
    }
  };
}
