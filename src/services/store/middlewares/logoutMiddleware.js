import {LOGOUT_SUCCESS} from '../actions/authentication/logout';
import {fetchAccountDetailsResetState} from '../actions/account/fetchAccountDetails';
import {fetchInvoicesResetState} from '../actions/invoices/fetchInvoices';
import {fetchCustomerResetState} from '../actions/customers/fetchCustomer';
import {fetchItemsResetState} from '../actions/items/fetchItems';
import {resetApiError} from '../actions/authentication/errorValidation';

export const clearStates = (store) => (next) => (action) => {
  if (action.type === LOGOUT_SUCCESS) {
    store.dispatch(resetApiError());
    store.dispatch(fetchAccountDetailsResetState());
    store.dispatch(fetchInvoicesResetState());
    store.dispatch(fetchCustomerResetState());
    store.dispatch(fetchItemsResetState());
  }
  next(action);
};
