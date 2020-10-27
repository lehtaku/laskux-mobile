import {
  FETCH_RECEIVED_INVOICES_REQUEST,
  FETCH_RECEIVED_INVOICES_REFRESH,
  FETCH_RECEIVED_INVOICES_SUCCESS,
  FETCH_RECEIVED_INVOICES_FAILURE,
  FETCH_RECEIVED_INVOICES_RESET_STATE,
} from '../../actions/invoices/fetchReceivedInvoices';

import RequestStates from '../../../../constants/States/RequestStates';
import InvoiceStates from '../../../../constants/States/InvoiceStates';

const initialState = {
  state: null,
  error: null,
  invoices: {
    all: [],
    open: [],
    paid: [],
    archived: [],
  },
};

const sortInvoicesByState = (invoices) => {
  const sorted = {
    open: [],
    paid: [],
    archived: [],
  };
  for (let i = 0; i < invoices.length; i++) {
    const {state} = invoices[i];
    switch (state) {
      case InvoiceStates.OPEN:
        sorted.open.push(invoices[i]);
        break;
      case InvoiceStates.PAID:
        sorted.paid.push(invoices[i]);
        break;
      case InvoiceStates.ARCHIVED:
        sorted.archived.push(invoices[i]);
        break;
      default:
        break;
    }
  }
  return sorted;
};

const fetchReceivedInvoicesReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_RECEIVED_INVOICES_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_RECEIVED_INVOICES_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_RECEIVED_INVOICES_SUCCESS:
      return {
        ...state,
        state: RequestStates.SUCCESS,
        invoices: {
          all: payload,
          ...sortInvoicesByState(payload),
        },
      };
    case FETCH_RECEIVED_INVOICES_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_RECEIVED_INVOICES_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchReceivedInvoicesReducer;
