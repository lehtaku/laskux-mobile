import {
  CREATE_INVOICE_PREVIEW_REQUEST,
  CREATE_INVOICE_PREVIEW_SUCCESS,
  CREATE_INVOICE_PREVIEW_FAILURE,
  CREATE_INVOICE_REQUEST,
  CREATE_INVOICE_SEND_REQUEST,
  CREATE_INVOICE_SUCCESS,
  CREATE_INVOICE_SEND_SUCCESS,
  CREATE_INVOICE_SEND_FAILURE,
  CREATE_INVOICE_FAILURE,
  CREATE_INVOICE_RESET_STATE,
} from '../../actions/invoices/createInvoice';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  previewData: null,
};

const createInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case CREATE_INVOICE_PREVIEW_REQUEST:
      return {...state, state: RequestStates.PREVIEW_LOADING, error: null};
    case CREATE_INVOICE_PREVIEW_SUCCESS:
      return {...state, state: RequestStates.PREVIEW_SUCCESS, previewData: payload};
    case CREATE_INVOICE_PREVIEW_FAILURE:
      return {...state, state: RequestStates.PREVIEW_FAILURE, error: payload};
    case CREATE_INVOICE_SEND_REQUEST:
      return {...state, state: RequestStates.SENDING, error: null};
    case CREATE_INVOICE_SEND_SUCCESS:
      return {...state, state: RequestStates.SEND_SUCCESS};
    case CREATE_INVOICE_SEND_FAILURE:
      return {...state, state: RequestStates.SEND_FAILURE, error: payload};
    case CREATE_INVOICE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case CREATE_INVOICE_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case CREATE_INVOICE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case CREATE_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default createInvoiceReducer;
