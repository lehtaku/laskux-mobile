import {getRequest} from '../../../api/get';

export const FETCH_SELLERS_REQUEST = 'FETCH_SELLERS_REQUEST';
function fetchSellersRequest() {
  return {
    type: FETCH_SELLERS_REQUEST,
  };
}

export const FETCH_SELLERS_SUCCESS = 'FETCH_SELLERS_SUCCESS';
function fetchSellersSuccess(data) {
  return {
    type: FETCH_SELLERS_SUCCESS,
    payload: data,
  };
}

export const FETCH_SELLERS_FAILURE = 'FETCH_SELLERS_FAILURE';
function fetchSellersFailure(error) {
  return {
    type: FETCH_SELLERS_FAILURE,
    payload: error,
  };
}

export const FETCH_SELLERS_RESET_STATE = 'FETCH_SELLERS_RESET_STATE';
export function fetchSellersResetState() {
  return {
    type: FETCH_SELLERS_RESET_STATE,
  };
}

export function fetchSellers(token) {
  return async function (dispatch) {
    dispatch(fetchSellersRequest());
    try {
      const sellers = await getRequest('/sellers', token);
      dispatch(fetchSellersSuccess(sellers));
    } catch (error) {
      dispatch(fetchSellersFailure(error));
    }
  };
}
