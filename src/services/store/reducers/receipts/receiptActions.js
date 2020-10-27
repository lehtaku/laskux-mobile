import {SET_RECEIPTS_STATE, RESET_RECEIPT_ACTION} from '../../actions/receipts/receiptActions';
import {RECEIPT_TYPES} from '../../../../constants/Types/ReceiptTypes';

const initialState = {
  type: RECEIPT_TYPES.ALL,
};

const receiptActionsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_RECEIPTS_STATE:
      return {...state, ...payload};
    case RESET_RECEIPT_ACTION:
      return initialState;
    default:
      return state;
  }
};

export default receiptActionsReducer;
