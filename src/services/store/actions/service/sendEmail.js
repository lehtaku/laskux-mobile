import {postRequest} from '../../../api/post';

export const SEND_EMAIL_REQUEST = 'SEND_EMAIL_REQUEST';
function sendEmailRequest() {
  return {
    type: SEND_EMAIL_REQUEST,
  };
}

export const SEND_EMAIL_SUCCESS = 'SEND_EMAIL_SUCCESS';
function sendEmailSuccess() {
  return {
    type: SEND_EMAIL_SUCCESS,
  };
}

export const SEND_EMAIL_FAILURE = 'SEND_EMAIL_FAILURE';
function sendEmailFailure(error) {
  return {
    type: SEND_EMAIL_FAILURE,
    payload: error,
  };
}

export const SEND_EMAIL_RESET_STATE = 'SEND_EMAIL_RESET_STATE';
export function sendEmailResetState() {
  return {
    type: SEND_EMAIL_RESET_STATE,
  };
}

export function sendEmail(token, data) {
  return async function (dispatch) {
    dispatch(sendEmailRequest());
    try {
      await postRequest('/service/send-email', token, data);
      dispatch(sendEmailSuccess());
    } catch (error) {
      dispatch(sendEmailFailure(error));
    }
  };
}
