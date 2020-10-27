import {
  SEARCH_COMPANY_BY_ID_REQUEST,
  SEARCH_COMPANY_BY_ID_SUCCESS,
  SEARCH_COMPANY_BY_ID_FAILURE,
  SEARCH_COMPANY_BY_ID_RESET_STATE,
} from '../../actions/tools/searchCompanyById';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  details: {
    business_id: null,
    name: null,
    address: null,
    city: null,
    zip_code: null,
    country_code: null,
    email: null,
    phone: null,
    www: null,
    vat_id: null,
    e_invoicing_addresses: [],
  },
};

const searchCompanyByIdReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SEARCH_COMPANY_BY_ID_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SEARCH_COMPANY_BY_ID_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, details: payload};
    case SEARCH_COMPANY_BY_ID_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SEARCH_COMPANY_BY_ID_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default searchCompanyByIdReducer;
