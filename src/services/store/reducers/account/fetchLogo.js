import {
  FETCH_LOGO_REQUEST,
  FETCH_LOGO_REFRESH,
  FETCH_LOGO_SUCCESS,
  FETCH_LOGO_FAILURE,
  FETCH_LOGO_RESET_STATE,
} from '../../actions/account/fetchLogo';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  logoData: null,
};

const fetchLogoReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_LOGO_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_LOGO_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_LOGO_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, logoData: payload};
    case FETCH_LOGO_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_LOGO_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchLogoReducer;
