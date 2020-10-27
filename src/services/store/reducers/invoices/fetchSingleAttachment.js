import {
  FETCH_SINGLE_ATTACHMENT_REQUEST,
  FETCH_SINGLE_ATTACHMENT_SUCCESS,
  FETCH_SINGLE_ATTACHMENT_FAILURE,
  FETCH_SINGLE_ATTACHMENT_RESET_STATE,
} from '../../actions/invoices/fetchSingleAttachment';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  attachmentId: null,
  attachment: {
    id: null,
    name: null,
    mime_type: null,
    file_size: null,
    file: null,
  },
};

const fetchSingleAttachmentReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_SINGLE_ATTACHMENT_REQUEST:
      return {...state, state: RequestStates.LOADING, attachmentId: payload, error: null};
    case FETCH_SINGLE_ATTACHMENT_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, attachment: payload};
    case FETCH_SINGLE_ATTACHMENT_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_SINGLE_ATTACHMENT_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchSingleAttachmentReducer;
