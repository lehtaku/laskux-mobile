import {
  SEARCH_COMPANY_BY_NAME_REQUEST,
  SEARCH_COMPANY_BY_NAME_SUCCESS,
  SEARCH_COMPANY_BY_NAME_FAILURE,
  SEARCH_COMPANY_BY_NAME_RESET_STATE,
} from '../../actions/tools/searchCompanyByName';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,

  count: null,
  list: [],
};

const searchCompanyByNameReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SEARCH_COMPANY_BY_NAME_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case SEARCH_COMPANY_BY_NAME_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, ...payload};
    case SEARCH_COMPANY_BY_NAME_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case SEARCH_COMPANY_BY_NAME_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default searchCompanyByNameReducer;
