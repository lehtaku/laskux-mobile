import {getRequest} from '../../../api/get';

export const FETCH_GROUPS_REQUEST = 'FETCH_GROUPS_REQUEST';
function fetchGroupsRequest() {
  return {
    type: FETCH_GROUPS_REQUEST,
  };
}

export const FETCH_GROUPS_SUCCESS = 'FETCH_GROUPS_SUCCESS';
function fetchGroupsSuccess(data) {
  return {
    type: FETCH_GROUPS_SUCCESS,
    payload: data,
  };
}

export const FETCH_GROUPS_FAILURE = 'FETCH_GROUPS_FAILURE';
function fetchGroupsFailure(error) {
  return {
    type: FETCH_GROUPS_FAILURE,
    payload: error,
  };
}

export const FETCH_GROUPS_RESET_STATE = 'FETCH_GROUPS_RESET_STATE';
export function fetchGroupsResetState() {
  return {
    type: FETCH_GROUPS_RESET_STATE,
  };
}

export function fetchGroups(token) {
  return async function (dispatch) {
    dispatch(fetchGroupsRequest());
    try {
      const groups = await getRequest('/groups', token);
      dispatch(fetchGroupsSuccess(groups));
    } catch (error) {
      dispatch(fetchGroupsFailure(error));
    }
  };
}
