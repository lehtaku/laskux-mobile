import {
  DELETE_OFFER_REQUEST,
  DELETE_OFFER_SUCCESS,
  DELETE_OFFER_FAILURE,
  DELETE_OFFER_RESET_STATE,
} from '../../actions/offers/deleteOffer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const deleteOfferReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case DELETE_OFFER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case DELETE_OFFER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case DELETE_OFFER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case DELETE_OFFER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default deleteOfferReducer;
