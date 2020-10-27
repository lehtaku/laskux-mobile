import {patchRequest} from '../../../api/update';

export const UPDATE_PERSONAL_DETAILS_REQUEST = 'UPDATE_PERSONAL_DETAILS_REQUEST';
function updatePersonalDetailsRequest() {
  return {
    type: UPDATE_PERSONAL_DETAILS_REQUEST,
  };
}

export const UPDATE_PERSONAL_DETAILS_SUCCESS = 'UPDATE_PERSONAL_DETAILS_SUCCESS';
function updatePersonalDetailsSuccess() {
  return {
    type: UPDATE_PERSONAL_DETAILS_SUCCESS,
  };
}

export const UPDATE_PERSONAL_DETAILS_FAILURE = 'UPDATE_PERSONAL_DETAILS_FAILURE';
function updatePersonalDetailsFailure(error) {
  return {
    type: UPDATE_PERSONAL_DETAILS_FAILURE,
    payload: error,
  };
}

export const UPDATE_PERSONAL_DETAILS_RESET_STATE = 'UPDATE_PERSONAL_DETAILS_RESET_STATE';
export function updatePersonalDetailsResetState() {
  return {
    type: UPDATE_PERSONAL_DETAILS_RESET_STATE,
  };
}

export function updatePersonalDetails(token, data) {
  return async function (dispatch) {
    dispatch(updatePersonalDetailsRequest());
    try {
      await patchRequest('/personal-settings', token, data);
      dispatch(updatePersonalDetailsSuccess());
    } catch (error) {
      dispatch(updatePersonalDetailsFailure(error));
    }
  };
}
