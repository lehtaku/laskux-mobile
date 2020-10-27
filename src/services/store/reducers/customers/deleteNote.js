import {
  DELETE_NOTE_REQUEST,
  DELETE_NOTE_SUCCESS,
  DELETE_NOTE_FAILURE,
  DELETE_NOTE_RESET_STATE,
} from '../../actions/customers/deleteNote';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const deleteCustomerNoteReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case DELETE_NOTE_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case DELETE_NOTE_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case DELETE_NOTE_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case DELETE_NOTE_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default deleteCustomerNoteReducer;
