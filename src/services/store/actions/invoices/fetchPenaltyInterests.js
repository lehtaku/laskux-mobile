import {getRequest} from '../../../api/get';

export const FETCH_PENALTY_INTERESTS_REQUEST = 'FETCH_PENALTY_INTERESTS_REQUEST';
function fetchPenaltyInterestsRequest() {
  return {
    type: FETCH_PENALTY_INTERESTS_REQUEST,
  };
}

export const FETCH_PENALTY_INTERESTS_SUCCESS = 'FETCH_PENALTY_INTERESTS_SUCCESS';
function fetchPenaltyInterestsSuccess(data) {
  return {
    type: FETCH_PENALTY_INTERESTS_SUCCESS,
    payload: data,
  };
}

export const FETCH_PENALTY_INTERESTS_FAILURE = 'FETCH_PENALTY_INTERESTS_FAILURE';
function fetchPenaltyInterestsFailure(error) {
  return {
    type: FETCH_PENALTY_INTERESTS_FAILURE,
    payload: error,
  };
}

export function fetchPenaltyInterests(token) {
  return async function (dispatch) {
    dispatch(fetchPenaltyInterestsRequest());
    try {
      const penaltyInterests = await getRequest('/invoice-penalty-interests', token);
      dispatch(fetchPenaltyInterestsSuccess(penaltyInterests));
    } catch (error) {
      dispatch(fetchPenaltyInterestsFailure(error));
    }
  };
}
