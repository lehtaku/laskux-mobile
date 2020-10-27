import {
  EDIT_OFFER_REQUEST,
  EDIT_OFFER_SUCCESS,
  EDIT_OFFER_FAILURE,
  EDIT_OFFER_RESET_STATE,
} from '../../actions/offers/editOffer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const editOfferReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case EDIT_OFFER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case EDIT_OFFER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case EDIT_OFFER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case EDIT_OFFER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default editOfferReducer;
