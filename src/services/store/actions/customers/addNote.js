import {postRequest} from '../../../api/post';

export const ADD_NOTE_REQUEST = 'ADD_NOTE_REQUEST';
function addNoteRequest() {
  return {
    type: ADD_NOTE_REQUEST,
  };
}

export const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS';
function addNoteSuccess() {
  return {
    type: ADD_NOTE_SUCCESS,
  };
}

export const ADD_NOTE_FAILURE = 'ADD_NOTE_FAILURE';
function addNoteFailure(error) {
  return {
    type: ADD_NOTE_FAILURE,
    payload: error,
  };
}

export const ADD_NOTE_RESET_STATE = 'ADD_NOTE_RESET_STATE';
export function addNoteResetState() {
  return {
    type: ADD_NOTE_RESET_STATE,
  };
}

export function addNote(customerId, token, data) {
  return async function (dispatch) {
    dispatch(addNoteRequest());
    try {
      await postRequest(`/customers/${customerId}/notes`, token, data);
      dispatch(addNoteSuccess());
    } catch (error) {
      dispatch(addNoteFailure(error));
    }
  };
}
