import {
  FETCH_PERSONAL_DETAILS_REQUEST,
  FETCH_PERSONAL_DETAILS_REFRESH,
  FETCH_PERSONAL_DETAILS_SUCCESS,
  FETCH_PERSONAL_DETAILS_FAILURE,
  FETCH_PERSONAL_DETAILS_RESET_STATE,
} from '../../actions/account/fetchPersonalDetails';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  details: {
    id: null,
    name: null,
    email: null,
    last_login: null,
    email_verified_at: null,
    created_at: null,
    updated_at: null,
  },
};

const fetchPersonalDetailsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_PERSONAL_DETAILS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_PERSONAL_DETAILS_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_PERSONAL_DETAILS_SUCCESS:
      return {
        ...state,
        state: RequestStates.SUCCESS,
        details: {...initialState.details, ...payload},
      };
    case FETCH_PERSONAL_DETAILS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_PERSONAL_DETAILS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchPersonalDetailsReducer;
