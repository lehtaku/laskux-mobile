import {
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_REFRESH,
  FETCH_CUSTOMERS_SUCCESS,
  FETCH_CUSTOMERS_FAILURE,
  FETCH_CUSTOMERS_RESET_STATE,
} from '../../actions/customers/fetchCustomers';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  customers: [],
};

const fetchCustomersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_CUSTOMERS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case FETCH_CUSTOMERS_REFRESH:
      return {...state, state: RequestStates.REFRESHING, error: null};
    case FETCH_CUSTOMERS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, customers: payload};
    case FETCH_CUSTOMERS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case FETCH_CUSTOMERS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default fetchCustomersReducer;
