import {getRequest} from '../../../api/get';

export const SALES_BY_MONTH_REQUEST = 'SALES_BY_MONTH_REQUEST';
function salesByMonthRequest() {
  return {
    type: SALES_BY_MONTH_REQUEST,
  };
}

export const SALES_BY_MONTH_SUCCESS = 'SALES_BY_MONTH_SUCCESS';
function salesByMonthSuccess(data) {
  return {
    type: SALES_BY_MONTH_SUCCESS,
    payload: data,
  };
}

export const SALES_BY_MONTH_FAILURE = 'SALES_BY_MONTH_FAILURE';
function salesByMonthFailure(error) {
  return {
    type: SALES_BY_MONTH_FAILURE,
    payload: error,
  };
}

export const SALES_BY_MONTH_RESET_STATE = 'SALES_BY_MONTH_RESET_STATE';
export function salesByMonthResetState() {
  return {
    type: SALES_BY_MONTH_RESET_STATE,
  };
}

export function fetchSalesByMonth(startingDate, endingDate, paymentState, token) {
  return async function (dispatch) {
    dispatch(salesByMonthRequest());
    try {
      const sales = await getRequest(
        `/reports/sales-by-month?value-date=invoice-date&start-date=${startingDate}&end-date=${endingDate}&payment-state=${paymentState}`,
        token,
      );
      dispatch(salesByMonthSuccess(sales));
    } catch (error) {
      dispatch(salesByMonthFailure(error));
    }
  };
}
