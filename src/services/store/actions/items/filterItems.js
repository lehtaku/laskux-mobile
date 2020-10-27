export const FILTER_ITEMS_SET_CATEGORY = 'FILTER_ITEMS_SET_CATEGORY';
export function filterItemsSetCategory(category) {
  return {
    type: FILTER_ITEMS_SET_CATEGORY,
    payload: category,
  };
}

export const FILTER_ITEMS_RESET_STATE = 'FILTER_ITEMS_RESET_STATE';
export function filterItemsResetState() {
  return {
    type: FILTER_ITEMS_RESET_STATE,
  };
}
