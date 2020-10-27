import {
  DELETE_CUSTOMER_REQUEST,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAILURE,
  DELETE_CUSTOMER_RESET_STATE,
} from '../../actions/customers/deleteCustomer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const deleteCustomerReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case DELETE_CUSTOMER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case DELETE_CUSTOMER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case DELETE_CUSTOMER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case DELETE_CUSTOMER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default deleteCustomerReducer;
