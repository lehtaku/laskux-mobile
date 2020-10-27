import {FILTER_ITEMS_SET_CATEGORY, FILTER_ITEMS_RESET_STATE} from '../../actions/items/filterItems';

const initialState = {
  category: 'all',
};

const filterItemsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FILTER_ITEMS_SET_CATEGORY:
      return {...state, category: payload};
    case FILTER_ITEMS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default filterItemsReducer;
