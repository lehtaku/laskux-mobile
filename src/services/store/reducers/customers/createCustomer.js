import {
  CREATE_CUSTOMER_REQUEST,
  CREATE_CUSTOMER_SUCCESS,
  CREATE_CUSTOMER_FAILURE,
  CREATE_CUSTOMER_RESET_STATE,
} from '../../actions/customers/createCustomer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  data: null,
};

const createCustomerReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case CREATE_CUSTOMER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case CREATE_CUSTOMER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, data: payload};
    case CREATE_CUSTOMER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case CREATE_CUSTOMER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default createCustomerReducer;
