import {getRequest} from '../../../api/get';

export const FETCH_ITEM_UNITS_REQUEST = 'FETCH_ITEM_UNITS_REQUEST';
function fetchItemUnitsRequest() {
  return {
    type: FETCH_ITEM_UNITS_REQUEST,
  };
}

export const FETCH_ITEM_UNITS_SUCCESS = 'FETCH_ITEM_UNITS_SUCCESS';
function fetchItemUnitsSuccess(data) {
  return {
    type: FETCH_ITEM_UNITS_SUCCESS,
    payload: data,
  };
}

export const FETCH_ITEM_UNITS_FAILURE = 'FETCH_ITEM_UNITS_FAILURE';
function fetchItemUnitsFailure(error) {
  return {
    type: FETCH_ITEM_UNITS_FAILURE,
    payload: error,
  };
}

export function fetchItemUnits(token) {
  return async function (dispatch) {
    dispatch(fetchItemUnitsRequest());
    try {
      const itemUnits = await getRequest('/item-units', token);
      dispatch(fetchItemUnitsSuccess(itemUnits));
    } catch (error) {
      dispatch(fetchItemUnitsFailure(error));
    }
  };
}
