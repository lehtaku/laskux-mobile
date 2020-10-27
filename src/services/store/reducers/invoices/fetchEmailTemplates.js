import {
  FETCH_EMAIL_TEMPLATES_REQUEST,
  FETCH_EMAIL_TEMPLATES_SUCCESS,
  FETCH_EMAIL_TEMPLATES_FAILURE,
  FETCH_EMAIL_TEMPLATES_RESET_STATE,
} from '../../actions/invoices/fetchEmailTemplates';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  templates: [],
};

const fetchEmailTemplatesReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_EMAIL_TEMPLATES_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_EMAIL_TEMPLATES_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, templates: payload};
    case FETCH_EMAIL_TEMPLATES_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_EMAIL_TEMPLATES_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchEmailTemplatesReducer;
