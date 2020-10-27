import {
  SEND_CREDIT_NOTE_REQUEST,
  SEND_CREDIT_NOTE_SUCCESS,
  SEND_CREDIT_NOTE_FAILURE,
  SEND_CREDIT_NOTE_RESET_STATE,
} from '../../actions/invoices/sendCreditNote';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const sendCreditNoteReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SEND_CREDIT_NOTE_REQUEST:
      return {...state, state: RequestStates.SENDING, error: null};
    case SEND_CREDIT_NOTE_SUCCESS:
      return {...state, state: RequestStates.SEND_SUCCESS};
    case SEND_CREDIT_NOTE_FAILURE:
      return {...state, state: RequestStates.SEND_FAILURE, error: payload};
    case SEND_CREDIT_NOTE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default sendCreditNoteReducer;
