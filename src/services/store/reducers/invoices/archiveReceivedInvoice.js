import {
  ARCHIVE_RECEIVED_INVOICE_REQUEST,
  ARCHIVE_RECEIVED_INVOICE_SUCCESS,
  ARCHIVE_RECEIVED_INVOICE_FAILURE,
  ARCHIVE_RECEIVED_INVOICE_RESET_STATE,
} from '../../actions/invoices/archiveReceivedInvoice';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const archiveReceivedInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ARCHIVE_RECEIVED_INVOICE_REQUEST:
      return {...state, state: RequestStates.LOADING};
    case ARCHIVE_RECEIVED_INVOICE_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case ARCHIVE_RECEIVED_INVOICE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case ARCHIVE_RECEIVED_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default archiveReceivedInvoiceReducer;
