import {
  FETCH_INVOICES_FAILURE,
  FETCH_INVOICES_REFRESH,
  FETCH_INVOICES_REQUEST,
  FETCH_INVOICES_RESET_STATE,
  FETCH_INVOICES_SUCCESS,
} from '../../actions/invoices/fetchInvoices';

import RequestStates from '../../../../constants/States/RequestStates';
import InvoiceStates from '../../../../constants/States/InvoiceStates';

const initialState = {
  state: null,
  error: null,
  invoices: {
    all: [],
    draft: [],
    open: [],
    paid: [],
    archived: [],
    deleted: [],
  },
};

const sortInvoicesByState = (invoices) => {
  const sorted = {
    draft: [],
    open: [],
    paid: [],
    archived: [],
    deleted: [],
  };
  for (let i = 0; i < invoices.length; i++) {
    const {dynamic_state} = invoices[i];
    switch (dynamic_state) {
      case InvoiceStates.DRAFT:
        sorted.draft.push(invoices[i]);
        break;
      case InvoiceStates.OPEN:
        sorted.open.push(invoices[i]);
        break;
      case InvoiceStates.PAID:
        sorted.paid.push(invoices[i]);
        break;
      case InvoiceStates.ARCHIVED:
        sorted.archived.push(invoices[i]);
        break;
      case InvoiceStates.DELETED:
        sorted.deleted.push(invoices[i]);
        break;
      default:
        break;
    }
  }
  return sorted;
};

const fetchInvoicesReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_INVOICES_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_INVOICES_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_INVOICES_SUCCESS:
      return {
        ...state,
        state: RequestStates.SUCCESS,
        invoices: {all: payload, ...sortInvoicesByState(payload)},
      };
    case FETCH_INVOICES_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_INVOICES_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchInvoicesReducer;
