import {postRequest} from '../../../api/post';

export const CREATE_CUSTOMER_REQUEST = 'CREATE_CUSTOMER_REQUEST';
function createCustomerRequest() {
  return {
    type: CREATE_CUSTOMER_REQUEST,
  };
}

export const CREATE_CUSTOMER_SUCCESS = 'CREATE_CUSTOMER_SUCCESS';
function createCustomerSuccess(data) {
  return {
    type: CREATE_CUSTOMER_SUCCESS,
    payload: data,
  };
}

export const CREATE_CUSTOMER_FAILURE = 'CREATE_CUSTOMER_FAILURE';
function createCustomerFailure(error) {
  return {
    type: CREATE_CUSTOMER_FAILURE,
    payload: error,
  };
}

export const CREATE_CUSTOMER_RESET_STATE = 'CREATE_CUSTOMER_RESET_STATE';
export function createCustomerResetState() {
  return {
    type: CREATE_CUSTOMER_RESET_STATE,
  };
}

export function createCustomer(token, data) {
  return async function (dispatch) {
    dispatch(createCustomerRequest());
    try {
      const customer = await postRequest('/customers', token, data);
      dispatch(createCustomerSuccess(customer));
    } catch (error) {
      dispatch(createCustomerFailure(error));
    }
  };
}
