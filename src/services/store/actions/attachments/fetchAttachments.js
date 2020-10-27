import {getRequest} from '../../../api/get';

export const FETCH_ATTACHMENTS_REQUEST = 'FETCH_ATTACHMENTS_REQUEST';
function fetchAttachmentsRequest() {
  return {
    type: FETCH_ATTACHMENTS_REQUEST,
  };
}

export const FETCH_ATTACHMENTS_SUCCESS = 'FETCH_ATTACHMENTS_SUCCESS';
function fetchAttachmentsSuccess(data) {
  return {
    type: FETCH_ATTACHMENTS_SUCCESS,
    payload: data,
  };
}

export const FETCH_ATTACHMENTS_FAILURE = 'FETCH_ATTACHMENTS_FAILURE';
function fetchAttachmentsFailure(error) {
  return {
    type: FETCH_ATTACHMENTS_FAILURE,
    payload: error,
  };
}

export const FETCH_ATTACHMENTS_RESET_STATE = 'FETCH_ATTACHMENTS_RESET_STATE';
export function fetchAttachmentsResetState() {
  return {
    type: FETCH_ATTACHMENTS_RESET_STATE,
  };
}

export function fetchAttachments(token) {
  return async function (dispatch) {
    dispatch(fetchAttachmentsRequest());
    try {
      const attachments = await getRequest('/attachments', token);
      dispatch(fetchAttachmentsSuccess(attachments));
    } catch (error) {
      dispatch(fetchAttachmentsFailure(error));
    }
  };
}
