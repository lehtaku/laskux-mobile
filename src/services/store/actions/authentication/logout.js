import {multiRemoveFromStorage} from '../../../storage/remove';
import {getRequest} from '../../../api/get';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
function logoutRequest() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error,
  };
}

export const LOGOUT_RESET_STATE = 'LOGOUT_RESET_STATE';
export function logoutResetState() {
  return {
    type: LOGOUT_RESET_STATE,
  };
}

export function logoutFromApiAndDevice(token) {
  return async function (dispatch) {
    dispatch(logoutRequest());
    try {
      await getRequest('/logout', token);
      await multiRemoveFromStorage(['CURRENT_ACCOUNT', 'ACCOUNTS']);
      dispatch(logoutSuccess());
    } catch (error) {
      dispatch(logoutFailure(error));
    }
  };
}

export function logoutFromDevice() {
  return async function (dispatch) {
    dispatch(logoutRequest());
    try {
      await multiRemoveFromStorage(['CURRENT_ACCOUNT', 'ACCOUNTS']);
      dispatch(logoutSuccess());
    } catch (error) {
      dispatch(logoutFailure(error));
    }
  };
}
