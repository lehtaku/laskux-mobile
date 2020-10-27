import {getRequest} from '../../../api/get';

export const SEARCH_COMPANY_BY_ID_REQUEST = 'SEARCH_COMPANY_BY_ID_REQUEST';
function searchCompanyByIdRequest() {
  return {
    type: SEARCH_COMPANY_BY_ID_REQUEST,
  };
}

export const SEARCH_COMPANY_BY_ID_SUCCESS = 'SEARCH_COMPANY_BY_ID_SUCCESS';
function searchCompanyByIdSuccess(data) {
  return {
    type: SEARCH_COMPANY_BY_ID_SUCCESS,
    payload: data,
  };
}

export const SEARCH_COMPANY_BY_ID_FAILURE = 'SEARCH_COMPANY_BY_ID_FAILURE';
function searchCompanyByIdFailure(error) {
  return {
    type: SEARCH_COMPANY_BY_ID_FAILURE,
    payload: error,
  };
}

export const SEARCH_COMPANY_BY_ID_RESET_STATE = 'SEARCH_COMPANY_BY_ID_RESET_STATE';
export function searchCompanyByIdResetState() {
  return {
    type: SEARCH_COMPANY_BY_ID_RESET_STATE,
  };
}

export function searchCompanyById(businessId, token) {
  return async function (dispatch) {
    dispatch(searchCompanyByIdRequest());
    try {
      const company = await getRequest(
        `/tools/search-company-by-business-id?business_id=${businessId}`,
        token,
      );
      dispatch(searchCompanyByIdSuccess(company));
    } catch (error) {
      dispatch(searchCompanyByIdFailure(error));
    }
  };
}
