import {
  EDIT_ITEM_REQUEST,
  EDIT_ITEM_SUCCESS,
  EDIT_ITEM_FAILURE,
  EDIT_ITEM_RESET_STATE,
} from '../../actions/items/editItem';

import RequestStates from '../../../../constants/States/RequestStates';

const initialState = {
  state: null,
  error: null,
  data: null,
};

const editItemReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case EDIT_ITEM_REQUEST:
      return {...state, state: RequestStates.LOADING, error: null};
    case EDIT_ITEM_SUCCESS:
      return {...state, state: RequestStates.SUCCESS, data: payload};
    case EDIT_ITEM_FAILURE:
      return {...state, state: RequestStates.ERROR, error: payload};
    case EDIT_ITEM_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default editItemReducer;
