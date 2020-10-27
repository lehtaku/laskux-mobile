import {getRequest} from '../../../api/get';

export const FETCH_OFFER_REQUEST = 'FETCH_OFFER_REQUEST';
function fetchOfferRequest() {
  return {
    type: FETCH_OFFER_REQUEST,
  };
}

export const FETCH_OFFER_SUCCESS = 'FETCH_OFFER_SUCCESS';
function fetchOfferSuccess(data) {
  return {
    type: FETCH_OFFER_SUCCESS,
    payload: data,
  };
}

export const FETCH_OFFER_FAILURE = 'FETCH_OFFER_FAILURE';
function fetchOfferFailure(error) {
  return {
    type: FETCH_OFFER_FAILURE,
    payload: error,
  };
}

export const FETCH_OFFER_RESET_STATE = 'FETCH_OFFER_RESET_STATE';
export function fetchOfferResetState() {
  return {
    type: FETCH_OFFER_RESET_STATE,
  };
}

export function fetchOffer(offerId, token) {
  return async function (dispatch) {
    dispatch(fetchOfferRequest());
    try {
      const offer = await getRequest(`/offers/${offerId}`, token);
      dispatch(fetchOfferSuccess(offer));
    } catch (error) {
      dispatch(fetchOfferFailure(error));
    }
  };
}
