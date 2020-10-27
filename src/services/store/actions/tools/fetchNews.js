import {getRequest} from '../../../api/get';

export const FETCH_NEWS_REQUEST = 'FETCH_NEWS_REQUEST';
function fetchNewsRequest() {
  return {
    type: FETCH_NEWS_REQUEST,
  };
}

export const FETCH_NEWS_REFRESH = 'FETCH_NEWS_REFRESH';
function fetchNewsRefresh() {
  return {
    type: FETCH_NEWS_REFRESH,
  };
}

export const FETCH_NEWS_SUCCESS = 'FETCH_NEWS_SUCCESS';
function fetchNewsSuccess(data) {
  return {
    type: FETCH_NEWS_SUCCESS,
    payload: data,
  };
}

export const FETCH_NEWS_FAILURE = 'FETCH_NEWS_FAILURE';
function fetchNewsFailure(error) {
  return {
    type: FETCH_NEWS_FAILURE,
    payload: error,
  };
}

export const FETCH_NEWS_RESET_STATE = 'FETCH_NEWS_RESET_STATE';
export function fetchNewsResetState() {
  return {
    type: FETCH_NEWS_RESET_STATE,
  };
}

export function fetchNews(token, isRefreshing = false) {
  return async function (dispatch) {
    if (isRefreshing) {
      dispatch(fetchNewsRefresh());
    } else {
      dispatch(fetchNewsRequest());
    }
    try {
      const news = await getRequest('/news', token);
      dispatch(fetchNewsSuccess(news));
    } catch (error) {
      dispatch(fetchNewsFailure(error));
    }
  };
}
