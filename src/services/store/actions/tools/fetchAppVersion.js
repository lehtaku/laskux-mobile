import {getRequest} from '../../../api/get';

export const FETCH_APP_VERSION_REQUEST = 'FETCH_APP_VERSION_REQUEST';
function fetchAppVersionRequest() {
  return {
    type: FETCH_APP_VERSION_REQUEST,
  };
}

export const FETCH_APP_VERSION_SUCCESS = 'FETCH_APP_VERSION_SUCCESS';
function fetchAppVersionSuccess(data) {
  return {
    type: FETCH_APP_VERSION_SUCCESS,
    payload: data,
  };
}

export const FETCH_APP_VERSION_FAILURE = 'FETCH_APP_VERSION_FAILURE';
function fetchAppVersionFailure(error) {
  return {
    type: FETCH_APP_VERSION_FAILURE,
    payload: error,
  };
}

export const FETCH_APP_VERSION_RESET_STATE = 'FETCH_APP_VERSION_RESET_STATE';
export function fetchAppVersionResetState() {
  return {
    type: FETCH_APP_VERSION_RESET_STATE,
  };
}

export function fetchAppVersion() {
  return async function (dispatch) {
    dispatch(fetchAppVersionRequest());
    try {
      const versions = await getRequest('/app-versions');
      dispatch(fetchAppVersionSuccess(versions));
    } catch (error) {
      dispatch(fetchAppVersionFailure(error));
    }
  };
}
