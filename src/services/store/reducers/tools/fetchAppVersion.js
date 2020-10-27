import {
  FETCH_APP_VERSION_REQUEST,
  FETCH_APP_VERSION_SUCCESS,
  FETCH_APP_VERSION_FAILURE,
  FETCH_APP_VERSION_RESET_STATE,
} from '../../actions/tools/fetchAppVersion';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,

  android: {
    app_store_url: null,
    latest_version: null,
  },
  ios: {
    app_store_url: null,
    latest_version: null,
  },
};

const fetchAppVersionReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_APP_VERSION_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_APP_VERSION_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case FETCH_APP_VERSION_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_APP_VERSION_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchAppVersionReducer;
