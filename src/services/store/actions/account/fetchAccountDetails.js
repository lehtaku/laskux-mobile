import {getRequest} from '../../../api/get';

export const FETCH_ACCOUNT_DETAILS_REQUEST = 'FETCH_ACCOUNT_DETAILS_REQUEST';
function fetchAccountDetailsRequest() {
  return {
    type: FETCH_ACCOUNT_DETAILS_REQUEST,
  };
}

export const FETCH_ACCOUNT_DETAILS_REFRESH = 'FETCH_ACCOUNT_DETAILS_REFRESH';
function fetchAccountDetailsRefresh() {
  return {
    type: FETCH_ACCOUNT_DETAILS_REFRESH,
  };
}

export const FETCH_ACCOUNT_DETAILS_SUCCESS = 'FETCH_ACCOUNT_DETAILS_SUCCESS';
function fetchAccountDetailsSuccess(data) {
  return {
    type: FETCH_ACCOUNT_DETAILS_SUCCESS,
    payload: data,
  };
}

export const FETCH_ACCOUNT_DETAILS_FAILURE = 'FETCH_ACCOUNT_DETAILS_FAILURE';
function fetchAccountDetailsFailure(error) {
  return {
    type: FETCH_ACCOUNT_DETAILS_FAILURE,
    payload: error,
  };
}

export const FETCH_ACCOUNT_DETAILS_RESET_STATE = 'FETCH_ACCOUNT_DETAILS_RESET_STATE';
export function fetchAccountDetailsResetState() {
  return {
    type: FETCH_ACCOUNT_DETAILS_RESET_STATE,
  };
}

export function fetchAccountDetails(token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchAccountDetailsRefresh());
    } else {
      dispatch(fetchAccountDetailsRequest());
    }
    try {
      const accountDetails = await getRequest('/account/info', token);
      dispatch(fetchAccountDetailsSuccess(accountDetails));
    } catch (error) {
      dispatch(fetchAccountDetailsFailure(error));
    }
  };
}
