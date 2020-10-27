import {
  VIEW_INVOICE_REQUEST,
  VIEW_INVOICE_SUCCESS,
  VIEW_INVOICE_FAILURE,
  VIEW_INVOICE_RESET_STATE,
} from '../../actions/invoices/viewInvoice';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  pdfData: null,
};

const viewInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case VIEW_INVOICE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case VIEW_INVOICE_SUCCESS:
      return {...state, state: VIEW_INVOICE_SUCCESS, pdfData: payload};
    case VIEW_INVOICE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case VIEW_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default viewInvoiceReducer;
