import {
  UPDATE_PERSONAL_DETAILS_REQUEST,
  UPDATE_PERSONAL_DETAILS_SUCCESS,
  UPDATE_PERSONAL_DETAILS_FAILURE,
  UPDATE_PERSONAL_DETAILS_RESET_STATE,
} from '../../actions/account/updatePersonalDetails';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const updatePersonalDetailsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_PERSONAL_DETAILS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case UPDATE_PERSONAL_DETAILS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case UPDATE_PERSONAL_DETAILS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case UPDATE_PERSONAL_DETAILS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default updatePersonalDetailsReducer;
