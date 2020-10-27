export const SET_API_ERROR = 'SET_ERROR';
export function setApiError({type, code}) {
  return {
    type: SET_API_ERROR,
    payload: {
      type: type,
      code: code,
    },
  };
}

export const RESET_API_ERROR = 'RESET_API_ERROR';
export function resetApiError() {
  return {
    type: RESET_API_ERROR,
  };
}
