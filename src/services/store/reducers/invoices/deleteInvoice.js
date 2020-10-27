import {
  DELETE_INVOICE_REQUEST,
  DELETE_INVOICE_SUCCESS,
  DELETE_INVOICE_FAILURE,
  DELETE_INVOICE_RESET_STATE,
} from '../../actions/invoices/deleteInvoice';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const deleteInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case DELETE_INVOICE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case DELETE_INVOICE_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case DELETE_INVOICE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case DELETE_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default deleteInvoiceReducer;
