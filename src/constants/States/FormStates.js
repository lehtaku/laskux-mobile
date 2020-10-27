import {CUSTOMER_TYPES} from '../Params/CustomerParams';

const CUSTOMER_FORM_INITIAL = {
  address: null,
  address2: null,
  business_id: null,
  city: null,
  country_code: 'FI',
  customer_number: null,
  e_invoicing_address: null,
  e_invoicing_operator: {
    id: null,
    name: null,
    code: null,
  },
  email: null,
  id: null,
  name: null,
  phone: null,
  type: CUSTOMER_TYPES.BUSINESS,
  vat_id: null,
  zip_code: null,
  primary_invoicing_format: null,
  groups: [],
  notes: [],
  available_invoicing_formats: [],
};

const ITEM_FORM_INITIAL = {
  id: null,
  name: null,
  unit: null,
  price: null,
  vat_percent: null,
  price_with_vat: null,
  vat_method: null,
  categories: [],
};

const INVOICE_FORM_INITIAL = {
  type: 'invoice',
  invoice_date: new Date(),
  terms_of_payment: null,
  penalty_interest: null,
  message: null,
  your_reference: null,
  vat_code: null,
  vat0_free_text: null,
  customer: CUSTOMER_FORM_INITIAL,
  bank_account_id: null,
  email: null,
  items: [],
  discount_rows: [],
  attachments: [],
  notes: [],
};

const SEND_INVOICE_FORM_INITIAL = {
  invoice_format: null,
  paid_date: new Date(),
  email: {
    subject: null,
    message: null,
  },
  attachments: [],
};

export const SEND_OFFER_FORM_INITIAL = {
  email: {
    subject: null,
    message: null,
  },
  attachments: [],
};

const OFFER_FORM_INITIAL = {
  offer_date: new Date(),
  customer: {
    id: null,
  },
  valid_to: null,
  details: null,
  message: null,
  author: null,
  items: [],
  discount_rows: [],
};

const RECEIPT_FORM_INITIAL = {
  type: 'loss',
  description: null,
  receipt_date: Date.now(),
  payment_method_id: null,
  profit_and_loss_account_id: null,
  seller: {
    id: null,
    name: null,
  },
  rows: [
    {
      gross_amount: 0,
      net_amount: 0,
      vat_amount: 0,
      vat_percent: 0,
    },
  ],
  attachments: [],
};

export {
  CUSTOMER_FORM_INITIAL,
  ITEM_FORM_INITIAL,
  INVOICE_FORM_INITIAL,
  OFFER_FORM_INITIAL,
  SEND_INVOICE_FORM_INITIAL,
  RECEIPT_FORM_INITIAL,
};
