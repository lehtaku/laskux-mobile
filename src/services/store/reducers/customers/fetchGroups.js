import {
  FETCH_GROUPS_REQUEST,
  FETCH_GROUPS_SUCCESS,
  FETCH_GROUPS_FAILURE,
  FETCH_GROUPS_RESET_STATE,
} from '../../actions/customers/fetchGroups';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  groups: [],
};

const fetchGroupsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_GROUPS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_GROUPS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, groups: payload};
    case FETCH_GROUPS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_GROUPS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchGroupsReducer;
