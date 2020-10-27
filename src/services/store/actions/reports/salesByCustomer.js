import {getRequest} from '../../../api/get';

export const SALES_BY_CUSTOMER_REQUEST = 'SALES_BY_CUSTOMER_REQUEST';
function salesByCustomerRequest() {
  return {
    type: SALES_BY_CUSTOMER_REQUEST,
  };
}

export const SALES_BY_CUSTOMER_SUCCESS = 'SALES_BY_CUSTOMER_SUCCESS';
function salesByCustomerSuccess(data) {
  return {
    type: SALES_BY_CUSTOMER_SUCCESS,
    payload: data,
  };
}

export const SALES_BY_CUSTOMER_FAILURE = 'SALES_BY_CUSTOMER_FAILURE';
function salesByCustomerFailure(error) {
  return {
    type: SALES_BY_CUSTOMER_FAILURE,
    payload: error,
  };
}

export const SALES_BY_CUSTOMER_RESET_STATE = 'SALES_BY_CUSTOMER_RESET_STATE';
export function salesByCustomerResetState() {
  return {
    type: SALES_BY_CUSTOMER_RESET_STATE,
  };
}

export function fetchSalesByCustomer(startingDate, endingDate, paymentState, token) {
  return async function (dispatch) {
    dispatch(salesByCustomerRequest());
    try {
      const sales = await getRequest(
        `/reports/sales-by-customer?value-date=invoice-date&start-date=${startingDate}&end-date=${endingDate}&payment-state=${paymentState}`,
        token,
      );
      dispatch(salesByCustomerSuccess(sales));
    } catch (error) {
      dispatch(salesByCustomerFailure(error));
    }
  };
}
