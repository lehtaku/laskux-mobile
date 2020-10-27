import {deleteRequest} from '../../../api/delete';

export const DELETE_OFFER_REQUEST = 'DELETE_OFFER_REQUEST';
function deleteOfferRequest() {
  return {
    type: DELETE_OFFER_REQUEST,
  };
}

export const DELETE_OFFER_SUCCESS = 'DELETE_OFFER_SUCCESS';
function deleteOfferSuccess() {
  return {
    type: DELETE_OFFER_SUCCESS,
  };
}

export const DELETE_OFFER_FAILURE = 'DELETE_OFFER_FAILURE';
function deleteOfferFailure(error) {
  return {
    type: DELETE_OFFER_FAILURE,
    payload: error,
  };
}

export const DELETE_OFFER_RESET_STATE = 'DELETE_OFFER_RESET_STATE';
export function deleteOfferResetState() {
  return {
    type: DELETE_OFFER_RESET_STATE,
  };
}

export function deleteOffer(offerId, token) {
  return async function (dispatch) {
    dispatch(deleteOfferRequest());
    try {
      await deleteRequest(`/offers/${offerId}`, token);
      dispatch(deleteOfferSuccess());
    } catch (error) {
      dispatch(deleteOfferFailure(error));
    }
  };
}
