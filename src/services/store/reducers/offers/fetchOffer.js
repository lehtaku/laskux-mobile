import {
  FETCH_OFFER_REQUEST,
  FETCH_OFFER_SUCCESS,
  FETCH_OFFER_FAILURE,
  FETCH_OFFER_RESET_STATE,
} from '../../actions/offers/fetchOffer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  offer: {
    id: null,
    customer_id: null,
    offer_number_prefix: null,
    offer_number: null,
    offer_number_complete: null,
    offer_date: null,
    valid_to: null,
    details: null,
    message: null,
    author: null,
    total_price: null,
    total_vat_price: null,
    total_price_with_vat: null,
    state: null,
    sending_state: null,
    email: null,
    created_at: null,
    updated_at: null,
    sent_at: null,
    sending_failed_at: null,
    approved_at: null,
    customer: {
      id: null,
      account_id: null,
      type: null,
      customer_number: null,
      name: null,
      business_id: null,
      vat_id: null,
      e_invoicing_operator_id: null,
      e_invoicing_address: null,
      country_code: null,
      address: null,
      address2: null,
      city: null,
      zip_code: null,
      email: null,
      phone: null,
      mobile: null,
      www: null,
      primary_invoicing_format: null,
      created_at: null,
      updated_at: null,
      available_invoicing_formats: [],
      full_address: null,
    },
    items: [],
  },
};

const fetchOfferReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_OFFER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_OFFER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, offer: payload};
    case FETCH_OFFER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_OFFER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchOfferReducer;
