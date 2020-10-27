import {getRequest} from '../../../api/get';

export const FETCH_LOGO_REQUEST = 'FETCH_LOGO_REQUEST';
function fetchLogoRequest() {
  return {
    type: FETCH_LOGO_REQUEST,
  };
}

export const FETCH_LOGO_REFRESH = 'FETCH_LOGO_REFRESH';
function fetchLogoRefresh() {
  return {
    type: FETCH_LOGO_REFRESH,
  };
}

export const FETCH_LOGO_SUCCESS = 'FETCH_LOGO_SUCCESS';
function fetchLogoSuccess(data) {
  return {
    type: FETCH_LOGO_SUCCESS,
    payload: data,
  };
}

export const FETCH_LOGO_FAILURE = 'FETCH_LOGO_FAILURE';
function fetchLogoFailure(error) {
  return {
    type: FETCH_LOGO_FAILURE,
    payload: error,
  };
}

export const FETCH_LOGO_RESET_STATE = 'FETCH_LOGO_RESET_STATE';
export function fetchLogoResetState() {
  return {
    type: FETCH_LOGO_RESET_STATE,
  };
}

export function fetchLogo(token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchLogoRefresh());
    } else {
      dispatch(fetchLogoRequest());
    }
    try {
      const logo = await getRequest('/account/logo', token);
      dispatch(fetchLogoSuccess(logo));
    } catch (error) {
      dispatch(fetchLogoFailure(error));
    }
  };
}
