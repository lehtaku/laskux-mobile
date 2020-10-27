import {patchRequest} from '../../../api/update';

export const EDIT_CUSTOMER_REQUEST = 'EDIT_CUSTOMER_REQUEST';
function editCustomerRequest() {
  return {
    type: EDIT_CUSTOMER_REQUEST,
  };
}

export const EDIT_CUSTOMER_SUCCESS = 'EDIT_CUSTOMER_SUCCESS';
function editCustomerSuccess(data) {
  return {
    type: EDIT_CUSTOMER_SUCCESS,
    payload: data,
  };
}

export const EDIT_CUSTOMER_FAILURE = 'EDIT_CUSTOMER_FAILURE';
function editCustomerFailure(error) {
  return {
    type: EDIT_CUSTOMER_FAILURE,
    payload: error,
  };
}

export const EDIT_CUSTOMER_RESET_STATE = 'EDIT_CUSTOMER_RESET_STATE';
export function editCustomerResetState() {
  return {
    type: EDIT_CUSTOMER_RESET_STATE,
  };
}

export function editCustomer(customerId, token, data) {
  return async function (dispatch) {
    dispatch(editCustomerRequest());
    try {
      const customer = await patchRequest(`/customers/${customerId}`, token, data);
      dispatch(editCustomerSuccess(customer));
    } catch (error) {
      dispatch(editCustomerFailure(error));
    }
  };
}
