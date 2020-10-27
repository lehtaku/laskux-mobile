import {setToStorage} from '../../../storage/set';

export const SET_ACCOUNT_REQUEST = 'SET_ACCOUNT_REQUEST';
function setAccountRequest() {
  return {
    type: SET_ACCOUNT_REQUEST,
  };
}

export const SET_ACCOUNT_SUCCESS = 'SET_ACCOUNT_SUCCESS';
function setAccountSuccess() {
  return {
    type: SET_ACCOUNT_SUCCESS,
  };
}

export const SET_ACCOUNT_FAILURE = 'SET_ACCOUNT_FAILURE';
function setAccountFailure(error) {
  return {
    type: SET_ACCOUNT_FAILURE,
    payload: error,
  };
}

export const SET_ACCOUNT_RESET_STATE = 'SET_ACCOUNT_RESET_STATE';
export function setAccountResetState() {
  return {
    type: SET_ACCOUNT_RESET_STATE,
  };
}

export function setAccount(account) {
  return async function (dispatch) {
    dispatch(setAccountRequest());
    try {
      await setToStorage('CURRENT_ACCOUNT', account);
      dispatch(setAccountSuccess());
    } catch (error) {
      dispatch(setAccountFailure(error));
    }
  };
}
