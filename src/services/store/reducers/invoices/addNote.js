import {
  ADD_NOTE_REQUEST,
  ADD_NOTE_SUCCESS,
  ADD_NOTE_FAILURE,
  ADD_NOTE_RESET_STATE,
} from '../../actions/invoices/addNote';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const addInvoiceNoteReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ADD_NOTE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case ADD_NOTE_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case ADD_NOTE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case ADD_NOTE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default addInvoiceNoteReducer;
