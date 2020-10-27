import {SET_API_ERROR, RESET_API_ERROR} from '../../actions/authentication/errorValidation';

const initialState = {
  error: {
    type: null,
    code: null,
  },
};

const errorValidationReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_API_ERROR:
      return {...state, error: payload};
    case RESET_API_ERROR:
      return initialState;
    default:
      return state;
  }
};

export default errorValidationReducer;
