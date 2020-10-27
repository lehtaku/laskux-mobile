import {postRequest} from '../../../api/post';

export const MARK_OFFER_AS_APPROVED_REQUEST = 'MARK_OFFER_AS_APPROVED_REQUEST';
function markOfferAsApprovedRequest() {
  return {
    type: MARK_OFFER_AS_APPROVED_REQUEST,
  };
}

export const MARK_OFFER_AS_APPROVED_SUCCESS = 'MARK_OFFER_AS_APPROVED_SUCCESS';
function markOfferAsApprovedSuccess() {
  return {
    type: MARK_OFFER_AS_APPROVED_SUCCESS,
  };
}

export const MARK_OFFER_AS_APPROVED_FAILURE = 'MARK_OFFER_AS_APPROVED_FAILURE';
function markOfferAsApprovedFailure(error) {
  return {
    type: MARK_OFFER_AS_APPROVED_FAILURE,
    payload: error,
  };
}

export const MARK_OFFER_AS_APPROVED_RESET_STATE = 'MARK_OFFER_AS_APPROVED_RESET_STATE';
export function markOfferAsApprovedResetState() {
  return {
    type: MARK_OFFER_AS_APPROVED_RESET_STATE,
  };
}

export function markAsApproved(offerId, token) {
  return async function (dispatch) {
    dispatch(markOfferAsApprovedRequest());
    try {
      await postRequest(`/offers/${offerId}/approve`, token);
      dispatch(markOfferAsApprovedSuccess());
    } catch (error) {
      dispatch(markOfferAsApprovedFailure(error));
    }
  };
}
