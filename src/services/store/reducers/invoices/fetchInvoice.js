import {
  FETCH_INVOICE_REQUEST,
  FETCH_INVOICE_REFRESH,
  FETCH_INVOICE_SUCCESS,
  FETCH_INVOICE_FAILURE,
  FETCH_INVOICE_RESET_STATE,
} from '../../actions/invoices/fetchInvoice';

import RequestStates from '../../../../constants/States/RequestStates';
import {CUSTOMER_FORM_INITIAL} from '../../../../constants/States/FormStates';

const initialState = {
  state: null,
  error: null,
  invoice: {
    id: null,
    account_id: null,
    customer_id: null,
    invoice_id: null,
    type: null,
    format: null,
    invoice_number_prefix: null,
    invoice_number: null,
    invoice_number_complete: null,
    reference_number: null,
    invoice_date: null,
    paid_date: null,
    due_date: null,
    penalty_interest: null,
    terms_of_payment: null,
    your_reference: null,
    message: null,
    total_price: null,
    total_vat_price: null,
    total_price_with_vat: null,
    discount_type: null,
    discount_calculation: null,
    discount_value: null,
    discount_amount: null,
    penalty_interest_type: null,
    penalty_interest_value: null,
    penalty_interest_amount: null,
    credited_amount: null,
    dynamic_total: null,
    vat_code: null,
    vat0_free_text: null,
    state: null,
    pdf_state: null,
    sending_state: null,
    email: null,
    created_at: null,
    updated_at: null,
    sent_at: null,
    reminder_sent_at: null,
    customer: CUSTOMER_FORM_INITIAL,
    items: [],
    discount_rows: [],
    notes: [],
  },
};

const fetchInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_INVOICE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_INVOICE_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_INVOICE_SUCCESS:
      return {
        ...state,
        state: RequestStates.SUCCESS,
        invoice: {...initialState.invoice, ...payload},
      };
    case FETCH_INVOICE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchInvoiceReducer;
