import React, {createContext, useState} from 'react';
import * as RNLocalize from 'react-native-localize';

const DEFAULT_CURRENCY = 'EUR';
const DEFAULT_LOCALE = {
  countryCode: 'FI',
  isRTL: false,
  languageCode: 'fi',
  languageTag: 'fi-FI',
};
const DEFAULT_NUMBER_FORMAT_SETTINGS = {
  decimalSeparator: '.',
  groupingSeparator: ',',
};

export const LocalizationContext = createContext({
  currency: DEFAULT_CURRENCY,
  locale: DEFAULT_LOCALE,
  numberFormatSettings: DEFAULT_NUMBER_FORMAT_SETTINGS,
  setLocalization: () => {},
  initializeLocalization: () => {},
});

export const LocalizationProvider = ({children}) => {
  // Standby for multiple currencies
  // const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [currency] = useState(DEFAULT_CURRENCY);
  const [numberFormatSettings, setNumberFormatSettings] = useState(DEFAULT_NUMBER_FORMAT_SETTINGS);
  const [locale] = useState(DEFAULT_LOCALE);

  const initializeLocalization = () => {
    // Standby for multiple currencies
    /*    const currencies = RNLocalize.getCurrencies();
    if (currencies) {
      setCurrency(currencies[0]);
    }*/
    // Standby for multiple languages
    /*    const locales = RNLocalize.getLocales();
    if (locales) {
      setLocale(locales[0]);
    }*/
    const numberFormats = RNLocalize.getNumberFormatSettings();
    if (numberFormats) {
      setNumberFormatSettings(numberFormats);
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        locale,
        numberFormatSettings,
        initializeLocalization,
      }}>
      {children}
    </LocalizationContext.Provider>
  );
};
