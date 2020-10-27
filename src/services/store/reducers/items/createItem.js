import {
  CREATE_ITEM_REQUEST,
  CREATE_ITEM_SUCCESS,
  CREATE_ITEM_FAILURE,
  CREATE_ITEM_RESET_STATE,
} from '../../actions/items/createItem';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  data: null,
};

const createItemReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case CREATE_ITEM_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case CREATE_ITEM_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, data: payload};
    case CREATE_ITEM_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case CREATE_ITEM_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default createItemReducer;
