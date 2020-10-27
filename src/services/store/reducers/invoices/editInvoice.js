import {
  EDIT_INVOICE_PREVIEW_REQUEST,
  EDIT_INVOICE_PREVIEW_SUCCESS,
  EDIT_INVOICE_PREVIEW_FAILURE,
  EDIT_INVOICE_REQUEST,
  EDIT_INVOICE_SEND_REQUEST,
  EDIT_INVOICE_SUCCESS,
  EDIT_INVOICE_SEND_SUCCESS,
  EDIT_INVOICE_SEND_FAILURE,
  EDIT_INVOICE_FAILURE,
  EDIT_INVOICE_RESET_STATE,
} from '../../actions/invoices/editInvoice';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  previewData: null,
};

const editInvoiceReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case EDIT_INVOICE_PREVIEW_REQUEST:
      return {...state, state: RequestStates.PREVIEW_LOADING, error: null};
    case EDIT_INVOICE_PREVIEW_SUCCESS:
      return {...state, state: RequestStates.PREVIEW_SUCCESS, previewData: payload};
    case EDIT_INVOICE_PREVIEW_FAILURE:
      return {...state, state: RequestStates.PREVIEW_FAILURE, error: payload};
    case EDIT_INVOICE_SEND_REQUEST:
      return {...state, state: RequestStates.SENDING, error: null};
    case EDIT_INVOICE_SEND_SUCCESS:
      return {...state, state: RequestStates.SEND_SUCCESS};
    case EDIT_INVOICE_SEND_FAILURE:
      return {...state, state: RequestStates.SEND_FAILURE, error: payload};
    case EDIT_INVOICE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case EDIT_INVOICE_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case EDIT_INVOICE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case EDIT_INVOICE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default editInvoiceReducer;
