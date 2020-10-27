import {getRequest} from '../../../api/get';

export const SEARCH_COMPANY_BY_NAME_REQUEST = 'SEARCH_COMPANY_BY_NAME_REQUEST';
function searchCompanyByNameRequest() {
  return {
    type: SEARCH_COMPANY_BY_NAME_REQUEST,
  };
}

export const SEARCH_COMPANY_BY_NAME_SUCCESS = 'SEARCH_COMPANY_BY_NAME_SUCCESS';
function searchCompanyByNameSuccess(data) {
  return {
    type: SEARCH_COMPANY_BY_NAME_SUCCESS,
    payload: data,
  };
}

export const SEARCH_COMPANY_BY_NAME_FAILURE = 'SEARCH_COMPANY_BY_NAME_FAILURE';
function searchCompanyByNameFailure(error) {
  return {
    type: SEARCH_COMPANY_BY_NAME_FAILURE,
    payload: error,
  };
}

export const SEARCH_COMPANY_BY_NAME_RESET_STATE = 'SEARCH_COMPANY_BY_NAME_RESET_STATE';
export function searchCompanyByNameResetState() {
  return {
    type: SEARCH_COMPANY_BY_NAME_RESET_STATE,
  };
}

export function searchCompanyByName(companyName, token) {
  return async function (dispatch) {
    dispatch(searchCompanyByNameRequest());
    try {
      const companies = await getRequest(
        `/tools/search-company-by-name?name=${companyName}`,
        token,
      );
      dispatch(searchCompanyByNameSuccess(companies));
    } catch (error) {
      dispatch(searchCompanyByNameFailure(error));
    }
  };
}
