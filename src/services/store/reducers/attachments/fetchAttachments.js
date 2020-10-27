import {
  FETCH_ATTACHMENTS_REQUEST,
  FETCH_ATTACHMENTS_SUCCESS,
  FETCH_ATTACHMENTS_FAILURE,
  FETCH_ATTACHMENTS_RESET_STATE,
} from '../../actions/attachments/fetchAttachments';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  attachments: [],
};

const fetchAttachmentsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_ATTACHMENTS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_ATTACHMENTS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, attachments: payload};
    case FETCH_ATTACHMENTS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_ATTACHMENTS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchAttachmentsReducer;
