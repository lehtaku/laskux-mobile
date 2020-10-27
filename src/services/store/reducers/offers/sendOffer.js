import {
  SEND_OFFER_REQUEST,
  SEND_OFFER_SUCCESS,
  SEND_OFFER_FAILURE,
  SEND_OFFER_RESET_STATE,
} from '../../actions/offers/sendOffer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const sendOfferReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SEND_OFFER_REQUEST:
      return {...state, state: RequestStates.SENDING, error: null};
    case SEND_OFFER_SUCCESS:
      return {...state, state: RequestStates.SEND_SUCCESS};
    case SEND_OFFER_FAILURE:
      return {...state, state: RequestStates.SEND_FAILURE, error: payload};
    case SEND_OFFER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default sendOfferReducer;
