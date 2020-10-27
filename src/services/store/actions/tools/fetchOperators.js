import {getRequest} from '../../../api/get';

export const FETCH_OPERATORS_REQUEST = 'FETCH_OPERATORS_REQUEST';
function fetchOperatorsRequest() {
  return {
    type: FETCH_OPERATORS_REQUEST,
  };
}

export const FETCH_OPERATORS_SUCCESS = 'FETCH_OPERATORS_SUCCESS';
function fetchOperatorsSuccess(data) {
  return {
    type: FETCH_OPERATORS_SUCCESS,
    payload: data,
  };
}

export const FETCH_OPERATORS_FAILURE = 'FETCH_OPERATORS_FAILURE';
function fetchOperatorsFailure(error) {
  return {
    type: FETCH_OPERATORS_FAILURE,
    payload: error,
  };
}

export const FETCH_OPERATORS_RESET_STATE = 'FETCH_OPERATORS_RESET_STATE';
export function fetchOperatorsResetState() {
  return {
    type: FETCH_OPERATORS_RESET_STATE,
  };
}

export function fetchOperators(token) {
  return async function (dispatch) {
    dispatch(fetchOperatorsRequest());
    try {
      const operators = await getRequest('/e-invoicing-operators', token);
      dispatch(fetchOperatorsSuccess(operators));
    } catch (error) {
      dispatch(fetchOperatorsFailure(error));
    }
  };
}
