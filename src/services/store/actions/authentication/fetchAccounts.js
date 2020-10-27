import {getFromStorage} from '../../../storage/get';

export const FETCH_ACCOUNTS_REQUEST = 'FETCH_ACCOUNTS_REQUEST';
function fetchAccountsRequest() {
  return {
    type: FETCH_ACCOUNTS_REQUEST,
  };
}

export const FETCH_ACCOUNTS_SUCCESS = 'FETCH_ACCOUNTS_SUCCESS';
function fetchAccountsSuccess(accounts) {
  return {
    type: FETCH_ACCOUNTS_SUCCESS,
    payload: accounts,
  };
}

export const FETCH_ACCOUNTS_FAILURE = 'FETCH_ACCOUNTS_FAILURE';
function fetchAccountsFailure(error) {
  return {
    type: FETCH_ACCOUNTS_FAILURE,
    payload: error,
  };
}

export const FETCH_ACCOUNTS_RESET_STATE = 'FETCH_ACCOUNTS_RESET_STATE';
export function fetchAccountsResetState() {
  return {
    type: FETCH_ACCOUNTS_RESET_STATE,
  };
}

export function fetchAccounts() {
  return async function (dispatch) {
    dispatch(fetchAccountsRequest());
    try {
      const accounts = await getFromStorage('ACCOUNTS');
      dispatch(fetchAccountsSuccess(accounts));
    } catch (error) {
      const customError = {
        message: 'Unable to load accounts.',
      };
      dispatch(fetchAccountsFailure(customError));
    }
  };
}
