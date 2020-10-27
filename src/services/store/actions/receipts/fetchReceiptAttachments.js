import {getRequest} from '../../../api/get';

export const FETCH_RECEIPT_ATTACHMENTS_REQUEST = 'FETCH_RECEIPT_ATTACHMENTS_REQUEST';
function fetchReceiptAttachmentsRequest() {
  return {
    type: FETCH_RECEIPT_ATTACHMENTS_REQUEST,
  };
}

export const FETCH_RECEIPT_ATTACHMENTS_SUCCESS = 'FETCH_RECEIPT_ATTACHMENTS_SUCCESS';
function fetchReceiptAttachmentsSuccess(data) {
  return {
    type: FETCH_RECEIPT_ATTACHMENTS_SUCCESS,
    payload: data,
  };
}

export const FETCH_RECEIPT_ATTACHMENTS_FAILURE = 'FETCH_RECEIPT_ATTACHMENTS_FAILURE';
function fetchReceiptAttachmentsFailure(error) {
  return {
    type: FETCH_RECEIPT_ATTACHMENTS_FAILURE,
    payload: error,
  };
}

export const FETCH_RECEIPT_ATTACHMENTS_RESET_STATE = 'FETCH_RECEIPT_ATTACHMENTS_RESET_STATE';
export function fetchReceiptAttachmentsResetState() {
  return {
    type: FETCH_RECEIPT_ATTACHMENTS_RESET_STATE,
  };
}

export function fetchReceiptAttachments(receiptId, token) {
  return async function (dispatch) {
    dispatch(fetchReceiptAttachmentsRequest());
    try {
      const attachments = await getRequest(`/receipts/${receiptId}/attachments`, token);
      dispatch(fetchReceiptAttachmentsSuccess(attachments));
    } catch (error) {
      dispatch(fetchReceiptAttachmentsFailure(error));
    }
  };
}
