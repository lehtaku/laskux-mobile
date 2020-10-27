export const SET_RECEIPTS_STATE = 'SET_RECEIPTS_STATE';
export function setReceiptsState(state) {
  return {
    type: SET_RECEIPTS_STATE,
    payload: state,
  };
}

export const RESET_RECEIPT_ACTION = 'RESET_RECEIPT_ACTION';
export function resetReceiptAction() {
  return {
    type: RESET_RECEIPT_ACTION,
  };
}
