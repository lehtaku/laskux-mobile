import {getRequest} from '../../../api/get';

export const FETCH_BANKS_REQUEST = 'FETCH_BANKS_REQUEST';
function fetchBanksRequest() {
  return {
    type: FETCH_BANKS_REQUEST,
  };
}

export const FETCH_BANKS_SUCCESS = 'FETCH_BANKS_SUCCESS';
function fetchBanksSuccess(data) {
  return {
    type: FETCH_BANKS_SUCCESS,
    payload: data,
  };
}

export const FETCH_BANKS_FAILURE = 'FETCH_BANKS_FAILURE';
function fetchBanksFailure(error) {
  return {
    type: FETCH_BANKS_FAILURE,
    payload: error,
  };
}

export const FETCH_BANKS_RESET_STATE = 'FETCH_BANKS_RESET_STATE';
export function fetchBanksResetState() {
  return {
    type: FETCH_BANKS_RESET_STATE,
  };
}

export function fetchBanks(token) {
  return async function (dispatch) {
    dispatch(fetchBanksRequest());
    try {
      const banks = await getRequest('/tools/get-banks', token);
      dispatch(fetchBanksSuccess(banks));
    } catch (error) {
      dispatch(fetchBanksFailure(error));
    }
  };
}
