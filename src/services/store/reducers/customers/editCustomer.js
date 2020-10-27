import {
  EDIT_CUSTOMER_REQUEST,
  EDIT_CUSTOMER_SUCCESS,
  EDIT_CUSTOMER_FAILURE,
  EDIT_CUSTOMER_RESET_STATE,
} from '../../actions/customers/editCustomer';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  data: null,
};

const editCustomerReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case EDIT_CUSTOMER_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case EDIT_CUSTOMER_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, data: payload};
    case EDIT_CUSTOMER_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case EDIT_CUSTOMER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default editCustomerReducer;
