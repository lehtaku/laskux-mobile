export const SET_OFFERS_STATE = 'SET_OFFERS_STATE';
export function setOffersState(state) {
  return {
    type: SET_OFFERS_STATE,
    payload: state,
  };
}

export const RESET_OFFER_ACTION = 'RESET_OFFER_ACTION';
export function resetOfferAction() {
  return {
    type: RESET_OFFER_ACTION,
  };
}
