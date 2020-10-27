import {setApiError} from '../actions/authentication/errorValidation';
import {ERROR_CODES, ERROR_TYPES} from '../../../constants/Types/ErrorTypes';
import {logoutFromDevice} from '../actions/authentication/logout';

export const errorCatcher = (store) => (next) => (action) => {
  if (action.type.includes('FAILURE') && action.payload) {
    if (action.payload.name && action.payload.message) {
      store.dispatch(
        setApiError({
          type: action.payload.name,
          code: action.payload.message,
        }),
      );
    } else if (action.payload.type && action.payload.code) {
      const type = action.payload.type;
      const code = action.payload.code;
      if (
        type === ERROR_TYPES.AUTHENTICATION_ERROR &&
        (code === ERROR_CODES.TOKEN_INVALID || code === ERROR_CODES.TOKEN_MISSING)
      ) {
        return store.dispatch(logoutFromDevice());
      }
      store.dispatch(
        setApiError({
          type: action.payload.type,
          code: action.payload.code,
        }),
      );
    }
  }
  return next(action);
};
