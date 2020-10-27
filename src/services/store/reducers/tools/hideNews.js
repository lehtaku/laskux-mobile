import {
  HIDE_NEWS_REQUEST,
  HIDE_NEWS_SUCCESS,
  HIDE_NEWS_FAILURE,
  HIDE_NEWS_RESET_STATE,
} from '../../actions/tools/hideNews';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  newsId: null,
};

const hideNewsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case HIDE_NEWS_REQUEST:
      return {...state, state: RequestStates.LOADING, newsId: payload, error: null};
    case HIDE_NEWS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case HIDE_NEWS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case HIDE_NEWS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default hideNewsReducer;
