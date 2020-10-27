import {
  FETCH_PENALTY_INTERESTS_REQUEST,
  FETCH_PENALTY_INTERESTS_SUCCESS,
  FETCH_PENALTY_INTERESTS_FAILURE,
} from '../../actions/invoices/fetchPenaltyInterests';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  penaltyInterests: [[]],
};

const fetchPenaltyInterestsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_PENALTY_INTERESTS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_PENALTY_INTERESTS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, penaltyInterests: payload};
    case FETCH_PENALTY_INTERESTS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    default:
      return state;
  }
};

export default fetchPenaltyInterestsReducer;
