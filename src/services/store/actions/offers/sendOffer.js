import {postRequest} from '../../../api/post';

export const SEND_OFFER_REQUEST = 'SEND_OFFER_REQUEST';
function sendOfferRequest() {
  return {
    type: SEND_OFFER_REQUEST,
  };
}

export const SEND_OFFER_SUCCESS = 'SEND_OFFER_SUCCESS';
function sendOfferSuccess() {
  return {
    type: SEND_OFFER_SUCCESS,
  };
}

export const SEND_OFFER_FAILURE = 'SEND_OFFER_FAILURE';
function sendOfferFailure(error) {
  return {
    type: SEND_OFFER_FAILURE,
    payload: error,
  };
}

export const SEND_OFFER_RESET_STATE = 'SEND_OFFER_RESET_STATE';
export function sendOfferResetState() {
  return {
    type: SEND_OFFER_RESET_STATE,
  };
}

export function sendOffer(offerId, token, data) {
  return async function (dispatch) {
    dispatch(sendOfferRequest());
    try {
      await postRequest(`/offers/${offerId}/send`, token, data);
      dispatch(sendOfferSuccess());
    } catch (error) {
      dispatch(sendOfferFailure(error));
    }
  };
}
