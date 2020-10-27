import {
  FETCH_OFFERS_REQUEST,
  FETCH_OFFER_REFRESH,
  FETCH_OFFERS_SUCCESS,
  FETCH_OFFERS_FAILURE,
  FETCH_OFFERS_RESET_STATE,
} from '../../actions/offers/fetchOffers';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  offers: [],
};

const fetchOffersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_OFFERS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_OFFER_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_OFFERS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, offers: payload};
    case FETCH_OFFERS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_OFFERS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchOffersReducer;
