import {patchRequest} from '../../../api/update';

export const UPDATE_ACCOUNT_DETAILS_REQUEST = 'UPDATE_ACCOUNT_DETAILS_REQUEST';
function updateAccountDetailsRequest() {
  return {
    type: UPDATE_ACCOUNT_DETAILS_REQUEST,
  };
}

export const UPDATE_ACCOUNT_DETAILS_SUCCESS = 'UPDATE_ACCOUNT_DETAILS_SUCCESS';
function updateAccountDetailsSuccess() {
  return {
    type: UPDATE_ACCOUNT_DETAILS_SUCCESS,
  };
}

export const UPDATE_ACCOUNT_DETAILS_FAILURE = 'UPDATE_ACCOUNT_DETAILS_FAILURE';
function updateAccountDetailsFailure(error) {
  return {
    type: UPDATE_ACCOUNT_DETAILS_FAILURE,
    payload: error,
  };
}

export const UPDATE_ACCOUNT_DETAILS_RESET_STATE = 'UPDATE_ACCOUNT_DETAILS_RESET_STATE';
export function updateAccountDetailsResetState() {
  return {
    type: UPDATE_ACCOUNT_DETAILS_RESET_STATE,
  };
}

export function updateAccountDetails(token, data) {
  return async function (dispatch) {
    dispatch(updateAccountDetailsRequest());
    try {
      await patchRequest('/account', token, data);
      dispatch(updateAccountDetailsSuccess());
    } catch (error) {
      dispatch(updateAccountDetailsFailure(error));
    }
  };
}
