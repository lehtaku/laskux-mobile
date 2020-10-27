import {deleteRequest} from '../../../api/delete';

export const DELETE_CUSTOMER_REQUEST = 'DELETE_CUSTOMER_REQUEST';
function deleteCustomerRequest() {
  return {
    type: DELETE_CUSTOMER_REQUEST,
  };
}

export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
function deleteCustomerSuccess() {
  return {
    type: DELETE_CUSTOMER_SUCCESS,
  };
}

export const DELETE_CUSTOMER_FAILURE = 'DELETE_CUSTOMER_FAILURE';
function deleteCustomerFailure(error) {
  return {
    type: DELETE_CUSTOMER_FAILURE,
    payload: error,
  };
}

export const DELETE_CUSTOMER_RESET_STATE = 'DELETE_CUSTOMER_RESET_STATE';
export function deleteCustomerResetState() {
  return {
    type: DELETE_CUSTOMER_RESET_STATE,
  };
}

export function deleteCustomer(customerId, token) {
  return async function (dispatch) {
    dispatch(deleteCustomerRequest());
    try {
      await deleteRequest(`/customers/${customerId}`, token);
      dispatch(deleteCustomerSuccess());
    } catch (error) {
      dispatch(deleteCustomerFailure(error));
    }
  };
}
