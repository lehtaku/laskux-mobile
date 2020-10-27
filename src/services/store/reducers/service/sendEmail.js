import {
  SEND_EMAIL_REQUEST,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_FAILURE,
  SEND_EMAIL_RESET_STATE,
} from '../../actions/service/sendEmail';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const sendEmailReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SEND_EMAIL_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SEND_EMAIL_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case SEND_EMAIL_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SEND_EMAIL_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default sendEmailReducer;
