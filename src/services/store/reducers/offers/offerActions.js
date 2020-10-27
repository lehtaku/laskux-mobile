import {SET_OFFERS_STATE, RESET_OFFER_ACTION} from '../../actions/offers/offerActions';
import OfferStates from '../../../../constants/States/OfferStates';

const initialState = {
  state: OfferStates.ALL,
};

const offerActionsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_OFFERS_STATE:
      return {...state, ...payload};
    case RESET_OFFER_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default offerActionsReducer;
