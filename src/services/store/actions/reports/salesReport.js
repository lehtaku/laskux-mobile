import {getRequest} from '../../../api/get';

export const SALES_REPORT_REQUEST = 'SALES_REPORT_REQUEST';
function salesReportRequest() {
  return {
    type: SALES_REPORT_REQUEST,
  };
}

export const SALES_REPORT_SUCCESS = 'SALES_REPORT_SUCCESS';
function salesReportSuccess(data) {
  return {
    type: SALES_REPORT_SUCCESS,
    payload: data,
  };
}

export const SALES_REPORT_FAILURE = 'SALES_REPORT_FAILURE';
function salesReportFailure(error) {
  return {
    type: SALES_REPORT_FAILURE,
    payload: error,
  };
}

export const SALES_REPORT_RESET_STATE = 'SALES_REPORT_RESET_STATE';
export function salesReportResetState() {
  return {
    type: SALES_REPORT_RESET_STATE,
  };
}

export function fetchSalesReport(startingDate, endingDate, paymentState, token) {
  return async function (dispatch) {
    dispatch(salesReportRequest());
    try {
      const sales = await getRequest(
        `/reports/sales-report?value-date=invoice-date&start-date=${startingDate}&end-date=${endingDate}&payment-state=${paymentState}`,
        token,
      );
      dispatch(salesReportSuccess(sales));
    } catch (error) {
      dispatch(salesReportFailure(error));
    }
  };
}
