import {startsWithNumber} from './validations';
import {parseCommasAndWhitespaces} from './stringHandling';
import {parseDecimalToLocale} from './currencies';

/*
 * Returns price in two decimals string, e.g. '15.35'
 */
export const getPriceWithVat = (price, vatPercent) => {
  if (!startsWithNumber(price)) {
    return null;
  }
  const parsedPrice = parseFloat(parseCommasAndWhitespaces(price));
  const parsedVat = parseFloat(vatPercent);
  const priceWithVat = parsedPrice + (parsedPrice * parsedVat) / 100;
  return priceWithVat.toString();
};

/*
 * Returns price in two decimals localized string, e.g. '15,35' in FIN
 */
export const getLocalePriceWithVat = (price, vatPercent, languageTag, currency) => {
  if (!startsWithNumber(price)) {
    return null;
  }
  const priceWithVat = getPriceWithVat(price, vatPercent);
  return parseDecimalToLocale(languageTag, currency, priceWithVat);
};

/*
 * Returns price in two decimals string, e.g. '15.35'
 */
export const getPriceWithoutVat = (priceWithVat, vatPercent) => {
  if (!startsWithNumber(priceWithVat)) {
    return null;
  }
  const parsedPrice = parseFloat(parseCommasAndWhitespaces(priceWithVat));
  const parsedVat = parseFloat(vatPercent);
  const price = (100 * parsedPrice) / (100 + parsedVat);
  return price.toString();
};

/*
 * Returns price in two decimals localized string, e.g. '15,35' in FIN
 */
export const getLocalePriceWithoutVat = (priceWithVat, vatPercent, languageTag, currency) => {
  if (!startsWithNumber(priceWithVat)) {
    return null;
  }
  const price = getPriceWithoutVat(priceWithVat, vatPercent);
  return parseDecimalToLocale(languageTag, currency, price);
};

/*
 * Parse float value to 2 decimals
 */
export const parseDecimal = (value) => {
  if (!startsWithNumber(value)) {
    return null;
  }
  return parseFloat(value).toFixed(2);
};

/*
 * Parse float value to 2 decimals and convert to string
 */
export const parseDecimalToString = (value) => {
  if (!startsWithNumber(value)) {
    return null;
  }
  return parseFloat(value).toFixed(2).toString();
};
