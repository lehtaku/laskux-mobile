import {getFromStorage} from '../../../storage/get';

export const FETCH_ACCOUNT_REQUEST = 'FETCH_ACCOUNT_REQUEST';
function fetchAccountRequest() {
  return {
    type: FETCH_ACCOUNT_REQUEST,
  };
}

export const FETCH_ACCOUNT_SUCCESS = 'FETCH_ACCOUNT_SUCCESS';
function fetchAccountSuccess(data) {
  return {
    type: FETCH_ACCOUNT_SUCCESS,
    payload: data,
  };
}

export const FETCH_ACCOUNT_FAILURE = 'FETCH_ACCOUNT_FAILURE';
function fetchAccountFailure(error) {
  return {
    type: FETCH_ACCOUNT_FAILURE,
    payload: error,
  };
}

export const FETCH_ACCOUNT_RESET_STATE = 'FETCH_ACCOUNT_RESET_STATE';
export function fetchAccountResetState() {
  return {
    type: FETCH_ACCOUNT_RESET_STATE,
  };
}

export function fetchAccount() {
  return async function (dispatch) {
    dispatch(fetchAccountRequest());
    try {
      const currentAccount = await getFromStorage('CURRENT_ACCOUNT');
      dispatch(fetchAccountSuccess(currentAccount));
    } catch (error) {
      dispatch(fetchAccountFailure(error));
    }
  };
}
