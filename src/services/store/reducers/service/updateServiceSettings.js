import {
  UPDATE_SERVICE_SETTINGS_REQUEST,
  UPDATE_SERVICE_SETTINGS_SUCCESS,
  UPDATE_SERVICE_SETTINGS_FAILURE,
  UPDATE_SERVICE_SETTINGS_RESET_STATE,
} from '../../actions/service/updateServiceSettings';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const updateServiceSettingsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_SERVICE_SETTINGS_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case UPDATE_SERVICE_SETTINGS_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case UPDATE_SERVICE_SETTINGS_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case UPDATE_SERVICE_SETTINGS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default updateServiceSettingsReducer;
