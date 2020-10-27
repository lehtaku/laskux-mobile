export const SET_SUCCESS_TOAST = 'SET_SUCCESS_TOAST';
export function setSuccessToast(ref) {
  return {
    type: SET_SUCCESS_TOAST,
    payload: ref,
  };
}

export const SET_DANGER_TOAST = 'SET_DANGER_TOAST';
export function setDangerToast(ref) {
  return {
    type: SET_DANGER_TOAST,
    payload: ref,
  };
}
