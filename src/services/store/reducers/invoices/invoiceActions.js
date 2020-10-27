import {SET_INVOICES_STATE, RESET_INVOICE_ACTION} from '../../actions/invoices/invoiceActions';

import InvoiceStates from '../../../../constants/States/InvoiceStates';
import {INVOICE_DIRECTIONS} from '../../../../constants/Types/InvoiceTypes';

const initialState = {
  invoicesDirection: INVOICE_DIRECTIONS.OUTGOING,
  dynamicState: InvoiceStates.ALL,
  subState: null,
  customer: {
    id: null,
    name: null,
  },
};

const invoiceActionsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_INVOICES_STATE:
      return {...state, ...payload};
    case RESET_INVOICE_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default invoiceActionsReducer;
