import {
  FILTER_CUSTOMERS_SET_GROUP,
  FILTER_CUSTOMERS_RESET_STATE,
} from '../../actions/customers/filterCustomers';

const initialState = {
  group: 'all',
};

const filterCustomersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FILTER_CUSTOMERS_SET_GROUP:
      return {...state, group: payload};
    case FILTER_CUSTOMERS_RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default filterCustomersReducer;
