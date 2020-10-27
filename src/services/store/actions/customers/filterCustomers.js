export const FILTER_CUSTOMERS_SET_GROUP = 'FILTER_CUSTOMERS_SET_GROUP';
export function filterCustomersSetCategory(group) {
  return {
    type: FILTER_CUSTOMERS_SET_GROUP,
    payload: group,
  };
}

export const FILTER_CUSTOMERS_RESET_STATE = 'FILTER_CUSTOMERS_RESET_STATE';
export function filterCustomersResetState() {
  return {
    type: FILTER_CUSTOMERS_RESET_STATE,
  };
}
