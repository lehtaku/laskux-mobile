import {setToStorage} from '../../../storage/set';
import {authenticate} from '../../../api/authentication';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  };
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
function loginSuccess(data) {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
  };
}

export const LOGIN_FAILURE = 'LOGIN_FAILURE';
function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  };
}

export const LOGIN_RESET_STATE = 'LOGIN_RESET_STATE';
export function loginResetState() {
  return {
    type: LOGIN_RESET_STATE,
  };
}

export function login(data) {
  return async function (dispatch) {
    dispatch(loginRequest());
    try {
      const accounts = await authenticate(data);
      await setToStorage('ACCOUNTS', accounts);
      if (accounts.length < 2) {
        await setToStorage('CURRENT_ACCOUNT', accounts[0]);
      }
      dispatch(loginSuccess(accounts));
    } catch (error) {
      dispatch(loginFailure(error));
    }
  };
}
