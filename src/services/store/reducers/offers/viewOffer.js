import {
  VIEW_OFFER_REQUEST,
  VIEW_OFFER_SUCCESS,
  VIEW_OFFER_FAILURE,
  VIEW_OFFER_RESET_STATE,
} from '../../actions/offers/viewOffer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  pdfData: null,
};

const viewOfferReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case VIEW_OFFER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case VIEW_OFFER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, pdfData: payload};
    case VIEW_OFFER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case VIEW_OFFER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default viewOfferReducer;
