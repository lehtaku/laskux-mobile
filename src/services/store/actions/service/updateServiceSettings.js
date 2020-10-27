import {patchRequest} from '../../../api/update';

export const UPDATE_SERVICE_SETTINGS_REQUEST = 'UPDATE_SERVICE_SETTINGS_REQUEST';
function updateServiceSettingsRequest() {
  return {
    type: UPDATE_SERVICE_SETTINGS_REQUEST,
  };
}

export const UPDATE_SERVICE_SETTINGS_SUCCESS = 'UPDATE_SERVICE_SETTINGS_SUCCESS';
function updateServiceSettingsSuccess() {
  return {
    type: UPDATE_SERVICE_SETTINGS_SUCCESS,
  };
}

export const UPDATE_SERVICE_SETTINGS_FAILURE = 'UPDATE_SERVICE_SETTINGS_FAILURE';
function updateServiceSettingsFailure(error) {
  return {
    type: UPDATE_SERVICE_SETTINGS_FAILURE,
    payload: error,
  };
}

export const UPDATE_SERVICE_SETTINGS_RESET_STATE = 'UPDATE_SERVICE_SETTINGS_RESET_STATE';
export function updateServiceSettingsResetState() {
  return {
    type: UPDATE_SERVICE_SETTINGS_RESET_STATE,
  };
}

export function updateServiceSettings(token, data) {
  return async function (dispatch) {
    dispatch(updateServiceSettingsRequest());
    try {
      await patchRequest('/service', token, data);
      dispatch(updateServiceSettingsSuccess());
    } catch (error) {
      dispatch(updateServiceSettingsFailure(error));
    }
  };
}
