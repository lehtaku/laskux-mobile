import {getRequest} from '../../../api/get';

export const FETCH_SINGLE_ATTACHMENT_REQUEST = 'FETCH_SINGLE_ATTACHMENT_REQUEST';
function fetchSingleAttachmentRequest(data) {
  return {
    type: FETCH_SINGLE_ATTACHMENT_REQUEST,
    payload: data,
  };
}

export const FETCH_SINGLE_ATTACHMENT_SUCCESS = 'FETCH_SINGLE_ATTACHMENT_SUCCESS';
function fetchSingleAttachmentSuccess(data) {
  return {
    type: FETCH_SINGLE_ATTACHMENT_SUCCESS,
    payload: data,
  };
}

export const FETCH_SINGLE_ATTACHMENT_FAILURE = 'FETCH_SINGLE_ATTACHMENT_FAILURE';
function fetchSingleAttachmentFailure(error) {
  return {
    type: FETCH_SINGLE_ATTACHMENT_FAILURE,
    payload: error,
  };
}

export const FETCH_SINGLE_ATTACHMENT_RESET_STATE = 'FETCH_SINGLE_ATTACHMENT_RESET_STATE';
export function fetchSingleAttachmentResetState() {
  return {
    type: FETCH_SINGLE_ATTACHMENT_RESET_STATE,
  };
}

export function fetchSingleAttachment(invoiceId, attachmentId, token) {
  return async function (dispatch) {
    dispatch(fetchSingleAttachmentRequest(attachmentId));
    try {
      const attachment = await getRequest(
        `/received-invoices/${invoiceId}/attachments/${attachmentId}`,
        token,
      );
      dispatch(fetchSingleAttachmentSuccess(attachment));
    } catch (error) {
      dispatch(fetchSingleAttachmentFailure(error));
    }
  };
}
