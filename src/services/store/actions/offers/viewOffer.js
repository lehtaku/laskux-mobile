import {getRequest} from '../../../api/get';

export const VIEW_OFFER_REQUEST = 'VIEW_OFFER_REQUEST';
function viewOfferRequest() {
  return {
    type: VIEW_OFFER_REQUEST,
  };
}

export const VIEW_OFFER_SUCCESS = 'VIEW_OFFER_SUCCESS';
function viewOfferSuccess(data) {
  return {
    type: VIEW_OFFER_SUCCESS,
    payload: data,
  };
}

export const VIEW_OFFER_FAILURE = 'VIEW_OFFER_FAILURE';
function viewOfferFailure(error) {
  return {
    type: VIEW_OFFER_FAILURE,
    payload: error,
  };
}

export const VIEW_OFFER_RESET_STATE = 'VIEW_OFFER_RESET_STATE';
export function viewOfferResetState() {
  return {
    type: VIEW_OFFER_RESET_STATE,
  };
}

export function viewOffer(offerId, token) {
  return async function (dispatch) {
    dispatch(viewOfferRequest());
    try {
      const pdf = await getRequest(`/offers/${offerId}/pdf`, token);
      dispatch(viewOfferSuccess(pdf.file));
    } catch (error) {
      dispatch(viewOfferFailure(error));
    }
  };
}
