import {postRequest} from '../../../api/post';

export const CREATE_OFFER_REQUEST = 'CREATE_OFFER_REQUEST';
function createOfferRequest() {
  return {
    type: CREATE_OFFER_REQUEST,
  };
}

export const CREATE_OFFER_SUCCESS = 'CREATE_OFFER_SUCCESS';
function createOfferSuccess() {
  return {
    type: CREATE_OFFER_SUCCESS,
  };
}

export const CREATE_OFFER_FAILURE = 'CREATE_OFFER_FAILURE';
function createOfferFailure(error) {
  return {
    type: CREATE_OFFER_FAILURE,
    payload: error,
  };
}

export const CREATE_OFFER_RESET_STATE = 'CREATE_OFFER_RESET_STATE';
export function createOfferResetState() {
  return {
    type: CREATE_OFFER_RESET_STATE,
  };
}

export function createOffer(token, data) {
  return async function (dispatch) {
    dispatch(createOfferRequest());
    try {
      await postRequest('/offers', token, data);
      dispatch(createOfferSuccess());
    } catch (error) {
      dispatch(createOfferFailure(error));
    }
  };
}
