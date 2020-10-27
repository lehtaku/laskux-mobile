import {parseCommasAndWhitespaces} from './stringHandling';
import {parseDecimal, parseDecimalToString} from './calculation';
import {formatDateYYYYMMDD} from './date';

export const getParsedInvoice = (invoice) => {
  return {
    ...invoice,
    discount_rows: invoice.discount_rows.map((item) => {
      const parsedPrice = parseCommasAndWhitespaces(item.price);
      const parsedPriceWithVat = parseCommasAndWhitespaces(item.price_with_vat);
      return {
        ...item,
        price: (-1 * parseDecimal(parsedPrice)).toString(),
        price_with_vat: (-1 * parseDecimal(parsedPriceWithVat)).toString(),
        vat_percent: parseInt(item.vat_percent, 10),
        vat_price: (-1 * parseDecimal(item.vat_price)).toString(),
      };
    }),
    invoice_date: formatDateYYYYMMDD(invoice.invoice_date),
    items: invoice.items.map((item) => {
      return {...item, quantity: parseCommasAndWhitespaces(item.quantity)};
    }),
  };
};

export const getParsedOffer = (offer) => {
  return {
    ...offer,
    discount_rows: offer.discount_rows.map((item) => {
      const parsedPrice = parseCommasAndWhitespaces(item.price);
      const parsedPriceWithVat = parseCommasAndWhitespaces(item.price_with_vat);
      return {
        ...item,
        price: (-1 * parseDecimal(parsedPrice)).toString(),
        price_with_vat: (-1 * parseDecimal(parsedPriceWithVat)).toString(),
        vat_percent: parseInt(item.vat_percent, 10),
        vat_price: (-1 * parseDecimal(item.vat_price)).toString(),
      };
    }),
    items: offer.items.map((item) => {
      return {
        ...item,
        quantity: parseCommasAndWhitespaces(item.quantity),
      };
    }),
  };
};

export const getParsedItem = (item) => {
  return {
    ...item,
    price: parseDecimalToString(parseCommasAndWhitespaces(item.price)),
    price_with_vat: parseDecimalToString(parseCommasAndWhitespaces(item.price_with_vat)),
  };
};

export const getParsedReceipt = (receipt) => {
  return {
    ...receipt,
    receipt_date: formatDateYYYYMMDD(receipt.receipt_date),
    rows: receipt.rows.map((item) => {
      return {
        gross_amount: parseDecimalToString(parseCommasAndWhitespaces(item.gross_amount)),
        net_amount: parseDecimalToString(parseCommasAndWhitespaces(item.net_amount)),
        vat_amount: parseDecimalToString(parseCommasAndWhitespaces(item.vat_amount)),
        vat_percent: item.vat_percent,
      };
    }),
  };
};

export const getParsedCustomer = (customer) => {
  if (customer.e_invoicing_operator) {
    return {...customer, e_invoicing_operator_id: customer.e_invoicing_operator.id};
  }
  return customer;
};
