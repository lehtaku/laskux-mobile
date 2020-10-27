import {
  CREATE_OFFER_REQUEST,
  CREATE_OFFER_SUCCESS,
  CREATE_OFFER_FAILURE,
  CREATE_OFFER_RESET_STATE,
} from '../../actions/offers/createOffer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const createOfferReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case CREATE_OFFER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case CREATE_OFFER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case CREATE_OFFER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case CREATE_OFFER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default createOfferReducer;
