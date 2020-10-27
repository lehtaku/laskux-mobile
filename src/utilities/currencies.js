import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/fi';

export const parseCurrencyToLocale = (languageTag, currency, inputValue) => {
  let value = parseFloat(inputValue);
  if (!value) {
    value = 0;
  }
  return new Intl.NumberFormat(languageTag, {style: 'currency', currency}).format(value);
};

export const parseDecimalToLocale = (languageTag, currency, inputValue) => {
  let value = parseFloat(inputValue);
  if (!value) {
    value = 0;
  }
  return new Intl.NumberFormat(languageTag, {
    style: 'decimal',
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
