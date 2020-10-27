import {getRequest} from '../../../api/get';

export const FETCH_PERSONAL_DETAILS_REQUEST = 'FETCH_PERSONAL_DETAILS_REQUEST';
function fetchPersonalDetailsRequest() {
  return {
    type: FETCH_PERSONAL_DETAILS_REQUEST,
  };
}

export const FETCH_PERSONAL_DETAILS_REFRESH = 'FETCH_PERSONAL_DETAILS_REFRESH';
function fetchPersonalDetailsRefresh() {
  return {
    type: FETCH_PERSONAL_DETAILS_REFRESH,
  };
}

export const FETCH_PERSONAL_DETAILS_SUCCESS = 'FETCH_PERSONAL_DETAILS_SUCCESS';
function fetchPersonalDetailsSuccess(data) {
  return {
    type: FETCH_PERSONAL_DETAILS_SUCCESS,
    payload: data,
  };
}

export const FETCH_PERSONAL_DETAILS_FAILURE = 'FETCH_PERSONAL_DETAILS_FAILURE';
function fetchPersonalDetailsFailure(error) {
  return {
    type: FETCH_PERSONAL_DETAILS_FAILURE,
    payload: error,
  };
}

export const FETCH_PERSONAL_DETAILS_RESET_STATE = 'FETCH_PERSONAL_DETAILS_RESET_STATE';
export function fetchPersonalDetailsResetState() {
  return {
    type: FETCH_PERSONAL_DETAILS_RESET_STATE,
  };
}

export function fetchPersonalDetails(token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchPersonalDetailsRefresh());
    } else {
      dispatch(fetchPersonalDetailsRequest());
    }
    try {
      const details = await getRequest('/personal-settings', token);
      dispatch(fetchPersonalDetailsSuccess(details.user));
    } catch (error) {
      dispatch(fetchPersonalDetailsFailure(error));
    }
  };
}
