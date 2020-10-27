import {postRequest} from '../../../api/post';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
function resetPasswordRequest() {
  return {
    type: RESET_PASSWORD_REQUEST,
  };
}

export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
function resetPasswordSuccess() {
  return {
    type: RESET_PASSWORD_SUCCESS,
  };
}

export const REST_PASSWORD_FAILURE = 'REST_PASSWORD_FAILURE';
function resetPasswordFailure(error) {
  return {
    type: REST_PASSWORD_FAILURE,
    payload: error,
  };
}

export const RESET_PASSWORD_RESET_STATE = 'RESET_PASSWORD_RESET_STATE';
export function resetPasswordResetState() {
  return {
    type: RESET_PASSWORD_RESET_STATE,
  };
}

export function resetPassword(token, data) {
  return async function (dispatch) {
    dispatch(resetPasswordRequest());
    try {
      await postRequest('/auth/reset-password', token, data);
      dispatch(resetPasswordSuccess());
    } catch (error) {
      dispatch(resetPasswordFailure(error));
    }
  };
}
