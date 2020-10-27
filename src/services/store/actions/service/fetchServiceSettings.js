import {getRequest} from '../../../api/get';

export const FETCH_SERVICE_SETTINGS_REQUEST = 'FETCH_SERVICE_SETTINGS_REQUEST';
function fetchServiceSettingsRequest() {
  return {
    type: FETCH_SERVICE_SETTINGS_REQUEST,
  };
}

export const FETCH_SERVICE_SETTINGS_SUCCESS = 'FETCH_SERVICE_SETTINGS_SUCCESS';
function fetchServiceSettingsSuccess(data) {
  return {
    type: FETCH_SERVICE_SETTINGS_SUCCESS,
    payload: data,
  };
}

export const FETCH_SERVICE_SETTINGS_FAILURE = 'FETCH_SERVICE_SETTINGS_FAILURE';
function fetchServiceSettingsFailure(error) {
  return {
    type: FETCH_SERVICE_SETTINGS_FAILURE,
    payload: error,
  };
}

export const FETCH_SERVICE_SETTINGS_RESET_STATE = 'FETCH_SERVICE_SETTINGS_RESET_STATE';
export function fetchServiceSettingsResetState() {
  return {
    type: FETCH_SERVICE_SETTINGS_RESET_STATE,
  };
}

export function fetchServiceSettings(token) {
  return async function (dispatch) {
    dispatch(fetchServiceSettingsRequest());
    try {
      const settings = await getRequest('/service', token);
      dispatch(fetchServiceSettingsSuccess(settings));
    } catch (error) {
      dispatch(fetchServiceSettingsFailure(error));
    }
  };
}
