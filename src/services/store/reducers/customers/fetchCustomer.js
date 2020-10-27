import {
  FETCH_CUSTOMER_REQUEST,
  FETCH_CUSTOMER_REFRESH,
  FETCH_CUSTOMER_SUCCESS,
  FETCH_CUSTOMER_FAILURE,
  FETCH_CUSTOMER_RESET_STATE,
} from '../../actions/customers/fetchCustomer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  customer: {
    id: null,
    type: null,
    customer_number: null,
    name: null,
    business_id: null,
    vat_id: null,
    e_invoicing_operator: {
      id: null,
      name: null,
      code: null,
    },
    e_invoicing_address: null,
    available_invoicing_formats: [],
    country_code: null,
    address: null,
    city: null,
    zip_code: null,
    email: null,
    phone: null,
    mobile: null,
    www: null,
    primary_invoicing_format: null,
    groups: [],
    notes: [],
  },
};

const fetchCustomerReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_CUSTOMER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_CUSTOMER_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_CUSTOMER_SUCCESS:
      return {
        ...state,
        state: RequestStates.SUCCESS,
        customer: {...initialState.customer, ...payload},
      };
    case FETCH_CUSTOMER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_CUSTOMER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchCustomerReducer;
