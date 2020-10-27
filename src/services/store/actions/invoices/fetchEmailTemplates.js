import {getRequest} from '../../../api/get';

export const FETCH_EMAIL_TEMPLATES_REQUEST = 'FETCH_EMAIL_TEMPLATES_REQUEST';
function fetchEmailTemplatesRequest() {
  return {
    type: FETCH_EMAIL_TEMPLATES_REQUEST,
  };
}

export const FETCH_EMAIL_TEMPLATES_SUCCESS = 'FETCH_EMAIL_TEMPLATES_SUCCESS';
function fetchEmailTemplatesSuccess(data) {
  return {
    type: FETCH_EMAIL_TEMPLATES_SUCCESS,
    payload: data,
  };
}

export const FETCH_EMAIL_TEMPLATES_FAILURE = 'FETCH_EMAIL_TEMPLATES_FAILURE';
function fetchEmailTemplatesFailure(error) {
  return {
    type: FETCH_EMAIL_TEMPLATES_FAILURE,
    payload: error,
  };
}

export const FETCH_EMAIL_TEMPLATES_RESET_STATE = 'FETCH_EMAIL_TEMPLATES_RESET_STATE';
export function fetchEmailTemplatesResetState() {
  return {
    type: FETCH_EMAIL_TEMPLATES_RESET_STATE,
  };
}

export function fetchEmailTemplates(params, token) {
  return async function (dispatch) {
    dispatch(fetchEmailTemplatesRequest());
    try {
      const templates = await getRequest(
        `/email-templates?type=${params.type}&convert=${params.convert}`,
        token,
      );
      dispatch(fetchEmailTemplatesSuccess(templates));
    } catch (error) {
      dispatch(fetchEmailTemplatesFailure(error));
    }
  };
}
