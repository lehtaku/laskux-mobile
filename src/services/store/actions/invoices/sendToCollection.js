import {postRequest} from '../../../api/post';

export const SEND_TO_COLLECTION_REQUEST = 'SEND_TO_COLLECTION_REQUEST';
function sendToCollectionRequest() {
  return {
    type: SEND_TO_COLLECTION_REQUEST,
  };
}

export const SEND_TO_COLLECTION_SUCCESS = 'SEND_TO_COLLECTION_SUCCESS';
function sendToCollectionSuccess() {
  return {
    type: SEND_TO_COLLECTION_SUCCESS,
  };
}

export const SEND_TO_COLLECTION_FAILURE = 'SEND_TO_COLLECTION_FAILURE';
function sendToCollectionFailure(error) {
  return {
    type: SEND_TO_COLLECTION_FAILURE,
    payload: error,
  };
}

export const SEND_TO_COLLECTION_RESET_STATE = 'SEND_TO_COLLECTION_RESET_STATE';
export function sendToCollectionResetState() {
  return {
    type: SEND_TO_COLLECTION_RESET_STATE,
  };
}

export function sendToCollection(invoiceId, token) {
  return async function (dispatch) {
    dispatch(sendToCollectionRequest());
    try {
      await postRequest(`/invoices/${invoiceId}/collection`, token, null);
      dispatch(sendToCollectionSuccess());
    } catch (error) {
      dispatch(sendToCollectionFailure(error));
    }
  };
}
