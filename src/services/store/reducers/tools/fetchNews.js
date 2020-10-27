import {
  FETCH_NEWS_REQUEST,
  FETCH_NEWS_REFRESH,
  FETCH_NEWS_SUCCESS,
  FETCH_NEWS_FAILURE,
  FETCH_NEWS_RESET_STATE,
} from '../../actions/tools/fetchNews';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  news: [],
};

const fetchNewsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_NEWS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_NEWS_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_NEWS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, news: payload};
    case FETCH_NEWS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_NEWS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchNewsReducer;
