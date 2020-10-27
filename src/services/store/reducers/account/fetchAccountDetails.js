import {
  FETCH_ACCOUNT_DETAILS_REQUEST,
  FETCH_ACCOUNT_DETAILS_REFRESH,
  FETCH_ACCOUNT_DETAILS_SUCCESS,
  FETCH_ACCOUNT_DETAILS_FAILURE,
  FETCH_ACCOUNT_DETAILS_RESET_STATE,
} from '../../actions/account/fetchAccountDetails';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,

  is_beta_tester: null,
  subscription: {
    id: null,
    account_id: null,
    card_id: null,
    plan_id: null,
    valid_to: null,
    price: null,
    currency: null,
    is_trial: null,
    credits_e_invoice_sending: null,
    credits_e_invoice_receiving: null,
    credits_paper_invoice_sending: null,
    credits_paper_invoice_receiving: null,
    state: null,
    created_at: null,
    updated_at: null,
    expired_at: null,
    cancelled_at: null,
    plan: {
      id: null,
      code: null,
      name: null,
      price_month: null,
      price_year: null,
      currency: null,
      is_default: null,
      is_trial: null,
      is_free: null,
      order: null,
      state: null,
      created_at: null,
      updated_at: null,
      deleted_at: null,
      features: [],
    },
    card: {
      id: null,
      account_id: null,
      payment_method_id: null,
      card_type: null,
      masked_number: null,
      expiration: null,
      default: null,
      created_at: null,
      updated_at: null,
      last_charge_at: null,
      last_failed_charge_at: null,
    },
  },
  details: {
    name: null,
    business_id: null,
    vat_id: null,
    available_invoicing_formats: [],
    address: null,
    zip_code: null,
    city: null,
    country_code: null,
    email: null,
    phone: null,
    fax: null,
    www: null,
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    details_filled: null,
  },
  prices: {
    sent_e_invoices: null,
    sent_paper_invoices: null,
    sent_paper_invoices_extra_pages: null,
    received_e_invoices: null,
    received_paper_invoices: null,
  },
  bank_accounts: [],
  invoice_receiving: {
    paper_invoices: {
      name: null,
      address_line1: null,
      address_line2: null,
      address_line3: null,
    },
    e_invoices: {
      operator_name: null,
      operator_code: null,
      e_invoicing_address: null,
    },
  },
  settings: {
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
  },
  invoices: {
    next_invoice_number: null,
    next_reference_number: null,
  },
  customers: {
    next_customer_number: null,
  },
  receipt_payment_methods: [],
  profit_and_loss_accounts: {
    profit: [],
    loss: [],
  },
};

const fetchAccountDetailsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_ACCOUNT_DETAILS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_ACCOUNT_DETAILS_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_ACCOUNT_DETAILS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case FETCH_ACCOUNT_DETAILS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_ACCOUNT_DETAILS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchAccountDetailsReducer;
