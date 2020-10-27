import {postRequest} from '../../../api/post';

export const HIDE_NEWS_REQUEST = 'HIDE_NEWS_REQUEST';
function hideNewsRequest(data) {
  return {
    type: HIDE_NEWS_REQUEST,
    payload: data,
  };
}

export const HIDE_NEWS_SUCCESS = 'HIDE_NEWS_SUCCESS';
function hideNewsSuccess() {
  return {
    type: HIDE_NEWS_SUCCESS,
  };
}

export const HIDE_NEWS_FAILURE = 'HIDE_NEWS_FAILURE';
function hideNewsFailure(error) {
  return {
    type: HIDE_NEWS_FAILURE,
    payload: error,
  };
}

export const HIDE_NEWS_RESET_STATE = 'HIDE_NEWS_RESET_STATE';
export function hideNewsResetState() {
  return {
    type: HIDE_NEWS_RESET_STATE,
  };
}

export function hideNews(token, newsId) {
  return async function (dispatch) {
    dispatch(hideNewsRequest(newsId));
    try {
      await postRequest(`/news/hide/${newsId}`, token, null);
      dispatch(hideNewsSuccess());
    } catch (error) {
      dispatch(hideNewsFailure(error));
    }
  };
}
