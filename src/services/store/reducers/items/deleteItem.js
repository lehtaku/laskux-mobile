import {
  DELETE_ITEM_REQUEST,
  DELETE_ITEM_SUCCESS,
  DELETE_ITEM_FAILURE,
  DELETE_ITEM_RESET_STATE,
} from '../../actions/items/deleteItem';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
};

const deleteItemReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case DELETE_ITEM_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case DELETE_ITEM_SUCCESS:
      return {...state, state: RequestStates.SUCCESS};
    case DELETE_ITEM_FAILURE:
      return {state: RequestStates.ERROR, error: payload};
    case DELETE_ITEM_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default deleteItemReducer;
