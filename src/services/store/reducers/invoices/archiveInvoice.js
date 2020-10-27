import {
  ARCHIVE_INVOICE_REQUEST,
  ARCHIVE_INVOICE_SUCCESS,
  ARCHIVE_INVOICE_FAILURE,
  ARCHIVE_INVOICE_RESET_STATE,
} from '../../actions/invoices/archiveInvoice';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const archiveInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ARCHIVE_INVOICE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case ARCHIVE_INVOICE_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case ARCHIVE_INVOICE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case ARCHIVE_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default archiveInvoiceReducer;
