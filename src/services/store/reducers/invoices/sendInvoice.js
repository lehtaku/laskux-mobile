import {
  SEND_INVOICE_REQUEST,
  SEND_INVOICE_SUCCESS,
  SEND_INVOICE_FAILURE,
  SEND_INVOICE_RESET_STATE,
} from '../../actions/invoices/sendInvoice';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const sendInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SEND_INVOICE_REQUEST:
      return {...state, state: RequestStates.SENDING, error: null};
    case SEND_INVOICE_SUCCESS:
      return {...state, state: RequestStates.SEND_SUCCESS};
    case SEND_INVOICE_FAILURE:
      return {...state, state: RequestStates.SEND_FAILURE, error: payload};
    case SEND_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default sendInvoiceReducer;
