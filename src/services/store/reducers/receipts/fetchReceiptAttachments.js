import {
  FETCH_RECEIPT_ATTACHMENTS_REQUEST,
  FETCH_RECEIPT_ATTACHMENTS_SUCCESS,
  FETCH_RECEIPT_ATTACHMENTS_FAILURE,
  FETCH_RECEIPT_ATTACHMENTS_RESET_STATE,
} from '../../actions/receipts/fetchReceiptAttachments';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  attachments: [],
};

const fetchReceiptAttachmentsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_RECEIPT_ATTACHMENTS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_RECEIPT_ATTACHMENTS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, attachments: payload};
    case FETCH_RECEIPT_ATTACHMENTS_FAILURE:
      return {...state, state: RequestStates.ERROR, attachments: payload};
    case FETCH_RECEIPT_ATTACHMENTS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchReceiptAttachmentsReducer;
