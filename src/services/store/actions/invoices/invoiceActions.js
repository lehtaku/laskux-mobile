export const SET_INVOICES_STATE = 'SET_INVOICES_STATE';
export function setInvoicesState(state) {
  return {
    type: SET_INVOICES_STATE,
    payload: state,
  };
}

export const RESET_INVOICE_ACTION = 'RESET_INVOICE_ACTION';
export function resetInvoiceAction() {
  return {
    type: RESET_INVOICE_ACTION,
  };
}
