import {getRequest} from '../../../api/get';

export const FETCH_RECEIPTS_REQUEST = 'FETCH_RECEIPTS_REQUEST';
function fetchReceiptsRequest() {
  return {
    type: FETCH_RECEIPTS_REQUEST,
  };
}

export const FETCH_RECEIPTS_REFRESH = 'FETCH_RECEIPTS_REFRESH';
function fetchReceiptsRefresh() {
  return {
    type: FETCH_RECEIPTS_REFRESH,
  };
}

export const FETCH_RECEIPTS_SUCCESS = 'FETCH_RECEIPTS_SUCCESS';
function fetchReceiptsSuccess(data) {
  return {
    type: FETCH_RECEIPTS_SUCCESS,
    payload: data,
  };
}

export const FETCH_RECEIPTS_FAILURE = 'FETCH_RECEIPTS_FAILURE';
function fetchReceiptsFailure(error) {
  return {
    type: FETCH_RECEIPTS_FAILURE,
    payload: error,
  };
}

export const FETCH_RECEIPTS_RESET_STATE = 'FETCH_RECEIPTS_RESET_STATE';
export function fetchReceiptsResetState() {
  return {
    type: FETCH_RECEIPTS_RESET_STATE,
  };
}

export function fetchReceipts(token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchReceiptsRefresh());
    } else {
      dispatch(fetchReceiptsRequest());
    }
    try {
      const receipts = await getRequest('/receipts', token);
      dispatch(fetchReceiptsSuccess(receipts));
    } catch (error) {
      dispatch(fetchReceiptsFailure(error));
    }
  };
}
