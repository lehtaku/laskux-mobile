import {
  MARK_OFFER_AS_APPROVED_REQUEST,
  MARK_OFFER_AS_APPROVED_SUCCESS,
  MARK_OFFER_AS_APPROVED_FAILURE,
  MARK_OFFER_AS_APPROVED_RESET_STATE,
} from '../../actions/offers/markOfferAsApproved';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const markOfferAsApprovedReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case MARK_OFFER_AS_APPROVED_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case MARK_OFFER_AS_APPROVED_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case MARK_OFFER_AS_APPROVED_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case MARK_OFFER_AS_APPROVED_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default markOfferAsApprovedReducer;
