import {postRequest} from '../../../api/post';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
function registerRequest() {
  return {
    type: REGISTER_REQUEST,
  };
}

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
function registerSuccess() {
  return {
    type: REGISTER_SUCCESS,
  };
}

export const REGISTER_FAILURE = 'REGISTER_FAILURE';
function registerFailure(error) {
  return {
    type: REGISTER_FAILURE,
    payload: error,
  };
}

export const REGISTER_RESET_STATE = 'REGISTER_RESET_STATE';
export function registerResetState() {
  return {
    type: REGISTER_RESET_STATE,
  };
}

export function register(token, data) {
  return async function (dispatch) {
    dispatch(registerRequest());
    try {
      await postRequest('/auth/register', token, data);
      dispatch(registerSuccess());
    } catch (error) {
      dispatch(registerFailure(error));
    }
  };
}
