import {patchRequest} from '../../../api/update';

export const EDIT_OFFER_REQUEST = 'EDIT_OFFER_REQUEST';
function editOfferRequest() {
  return {
    type: EDIT_OFFER_REQUEST,
  };
}

export const EDIT_OFFER_SUCCESS = 'EDIT_OFFER_SUCCESS';
function editOfferSuccess() {
  return {
    type: EDIT_OFFER_SUCCESS,
  };
}

export const EDIT_OFFER_FAILURE = 'EDIT_OFFER_FAILURE';
function editOfferFailure(error) {
  return {
    type: EDIT_OFFER_FAILURE,
    payload: error,
  };
}

export const EDIT_OFFER_RESET_STATE = 'EDIT_OFFER_RESET_STATE';
export function editOfferResetState() {
  return {
    type: EDIT_OFFER_RESET_STATE,
  };
}

export function editOffer(offerId, token, data) {
  return async function (dispatch) {
    dispatch(editOfferRequest());
    try {
      await patchRequest(`/offers/${offerId}`, token, data);
      dispatch(editOfferSuccess());
    } catch (error) {
      dispatch(editOfferFailure(error));
    }
  };
}
