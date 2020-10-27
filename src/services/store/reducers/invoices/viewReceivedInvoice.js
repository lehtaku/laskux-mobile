import {
  VIEW_RECEIVED_INVOICE_REQUEST,
  VIEW_RECEIVED_INVOICE_SUCCESS,
  VIEW_RECEIVED_INVOICE_FAILURE,
  VIEW_RECEIVED_INVOICE_RESET_STATE,
} from '../../actions/invoices/viewReceivedInvoice';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  pdfData: null,
};

const viewReceivedInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case VIEW_RECEIVED_INVOICE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case VIEW_RECEIVED_INVOICE_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, pdfData: payload};
    case VIEW_RECEIVED_INVOICE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case VIEW_RECEIVED_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default viewReceivedInvoiceReducer;
