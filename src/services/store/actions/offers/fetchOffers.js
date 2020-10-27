import {getRequest} from '../../../api/get';

export const FETCH_OFFERS_REQUEST = 'FETCH_OFFERS_REQUEST';
function fetchOffersRequest() {
  return {
    type: FETCH_OFFERS_REQUEST,
  };
}

export const FETCH_OFFER_REFRESH = 'FETCH_OFFER_REFRESH';
function fetchOffersRefresh() {
  return {
    type: FETCH_OFFER_REFRESH,
  };
}

export const FETCH_OFFERS_SUCCESS = 'FETCH_OFFERS_SUCCESS';
function fetchOffersSuccess(data) {
  return {
    type: FETCH_OFFERS_SUCCESS,
    payload: data,
  };
}

export const FETCH_OFFERS_FAILURE = 'FETCH_OFFERS_FAILURE';
function fetchOffersFailure(error) {
  return {
    type: FETCH_OFFERS_FAILURE,
    payload: error,
  };
}

export const FETCH_OFFERS_RESET_STATE = 'FETCH_OFFERS_RESET_STATE';
export function fetchOffersResetState() {
  return {
    type: FETCH_OFFERS_RESET_STATE,
  };
}

export function fetchOffers(token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchOffersRefresh());
    } else {
      dispatch(fetchOffersRequest());
    }
    try {
      const offers = await getRequest('/offers', token);
      dispatch(fetchOffersSuccess(offers));
    } catch (error) {
      dispatch(fetchOffersFailure(error));
    }
  };
}
