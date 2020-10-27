import {
  SEND_INVOICE_REMINDER_REQUEST,
  SEND_INVOICE_REMINDER_SUCCESS,
  SEND_INVOICE_REMINDER_FAILURE,
  SEND_INVOICE_REMINDER_RESET_STATE,
} from '../../actions/invoices/sendInvoiceReminder';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const sendInvoiceReminderReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SEND_INVOICE_REMINDER_REQUEST:
      return {...state, state: RequestStates.SENDING, error: null};
    case SEND_INVOICE_REMINDER_SUCCESS:
      return {...state, state: RequestStates.SEND_SUCCESS};
    case SEND_INVOICE_REMINDER_FAILURE:
      return {...state, state: RequestStates.SEND_FAILURE, error: payload};
    case SEND_INVOICE_REMINDER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default sendInvoiceReminderReducer;
