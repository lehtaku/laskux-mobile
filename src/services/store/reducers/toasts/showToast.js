import {SET_SUCCESS_TOAST, SET_DANGER_TOAST} from '../../actions/toasts/showToast';

const initialState = {
  successToast: null,
  dangerToast: null,
};

const showToastReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_SUCCESS_TOAST:
      return {...state, successToast: payload};
    case SET_DANGER_TOAST:
      return {...state, dangerToast: payload};
    default:
      return state;
  }
};

export default showToastReducer;
