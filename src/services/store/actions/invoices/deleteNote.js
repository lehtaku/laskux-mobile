import {deleteRequest} from '../../../api/delete';

export const DELETE_NOTE_REQUEST = 'DELETE_NOTE_REQUEST';
function deleteNoteRequest() {
  return {
    type: DELETE_NOTE_REQUEST,
  };
}

export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
function deleteNoteSuccess() {
  return {
    type: DELETE_NOTE_SUCCESS,
  };
}

export const DELETE_NOTE_FAILURE = 'DELETE_NOTE_FAILURE';
function deleteNoteFailure(error) {
  return {
    type: DELETE_NOTE_FAILURE,
    payload: error,
  };
}

export const DELETE_NOTE_RESET_STATE = 'DELETE_NOTE_RESET_STATE';
export function deleteNoteResetState() {
  return {
    type: DELETE_NOTE_RESET_STATE,
  };
}

export function deleteNote(invoiceId, noteId, token) {
  return async function (dispatch) {
    dispatch(deleteNoteRequest());
    try {
      await deleteRequest(`/invoices/${invoiceId}/notes/${noteId}`, token);
      dispatch(deleteNoteSuccess());
    } catch (error) {
      dispatch(deleteNoteFailure(error));
    }
  };
}
