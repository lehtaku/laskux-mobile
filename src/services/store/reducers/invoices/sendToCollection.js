import {
  SEND_TO_COLLECTION_REQUEST,
  SEND_TO_COLLECTION_SUCCESS,
  SEND_TO_COLLECTION_FAILURE,
  SEND_TO_COLLECTION_RESET_STATE,
} from '../../actions/invoices/sendToCollection';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const sendToCollectionReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SEND_TO_COLLECTION_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SEND_TO_COLLECTION_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case SEND_TO_COLLECTION_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SEND_TO_COLLECTION_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default sendToCollectionReducer;
