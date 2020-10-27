import {
  FETCH_SERVICE_SETTINGS_REQUEST,
  FETCH_SERVICE_SETTINGS_SUCCESS,
  FETCH_SERVICE_SETTINGS_FAILURE,
  FETCH_SERVICE_SETTINGS_RESET_STATE,
} from '../../actions/service/fetchServiceSettings';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,

  customers: {
    default_customer_type: null,
    customer_numbers: null,
    incremental_number: null,
  },
  invoices: {
    terms_of_payment: null,
    penalty_interest: null,
    item_dates: null,
    vat_code: null,
    vat0_free_text: null,
  },
  items: {
    default_vat: null,
    default_unit: null,
    vat_type: null,
  },
  invoice_pdf: {
    show_barcode: null,
  },
};

const fetchServiceSettingsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_SERVICE_SETTINGS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_SERVICE_SETTINGS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case FETCH_SERVICE_SETTINGS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_SERVICE_SETTINGS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchServiceSettingsReducer;
