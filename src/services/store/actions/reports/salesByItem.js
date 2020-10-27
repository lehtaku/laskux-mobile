import {getRequest} from '../../../api/get';

export const SALES_BY_ITEM_REQUEST = 'SALES_BY_ITEM_REQUEST';
function salesByItemRequest() {
  return {
    type: SALES_BY_ITEM_REQUEST,
  };
}

export const SALES_BY_ITEM_SUCCESS = 'SALES_BY_ITEM_SUCCESS';
function salesByItemSuccess(data) {
  return {
    type: SALES_BY_ITEM_SUCCESS,
    payload: data,
  };
}

export const SALES_BY_ITEM_FAILURE = 'SALES_BY_ITEM_FAILURE';
function salesByItemFailure(error) {
  return {
    type: SALES_BY_ITEM_FAILURE,
    payload: error,
  };
}

export const SALES_BY_ITEM_RESET_STATE = 'SALES_BY_ITEM_RESET_STATE';
export function salesByItemResetState() {
  return {
    type: SALES_BY_ITEM_RESET_STATE,
  };
}

export function fetchSalesByItem(startingDate, endingDate, paymentState, token) {
  return async function (dispatch) {
    dispatch(salesByItemRequest());
    try {
      const sales = await getRequest(
        `/reports/sales-by-item?value-date=invoice-date&start-date=${startingDate}&end-date=${endingDate}&payment-state=${paymentState}`,
        token,
      );
      dispatch(salesByItemSuccess(sales));
    } catch (error) {
      dispatch(salesByItemFailure(error));
    }
  };
}
