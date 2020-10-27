import React, {useCallback, useContext, useEffect, useState} from 'react';

import {FlatList, StyleSheet, View} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {fetchSalesByMonth} from '../../services/store/actions/reports/salesByMonth';
import {formatDateYYYYMMDD, getDateFromBeginningOfYear} from '../../utilities/date';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import Translations from '../../services/localization/Translations';
import {parseCurrencyToLocale} from '../../utilities/currencies';

import RequestStates from '../../constants/States/RequestStates';
import Styles from '../../constants/Styles';
import {EXCLUDING_VAT, INCLUDING_VAT} from '../../constants/Params/ItemParams';
import InvoiceStates from '../../constants/States/InvoiceStates';

import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import EmptyReportNotification from '../../components/Notifications/EmptyReportNotification';
import CustomListItem from '../../components/ListItems/CustomListItem';
import ReportForm from '../../components/Forms/ReportForm';

export default function SalesByMonthScreen() {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const salesByMonthState = useSelector((store) => store.salesByMonth);

  const [options, setOptions] = useState({
    fromDate: getDateFromBeginningOfYear(),
    toDate: new Date(),
    paymentState: InvoiceStates.ALL,
    priceDisplay: EXCLUDING_VAT,
  });

  const {locale, currency} = useContext(LocalizationContext);

  const loadData = useCallback(() => {
    dispatch(
      fetchSalesByMonth(
        formatDateYYYYMMDD(options.fromDate),
        formatDateYYYYMMDD(options.toDate),
        options.paymentState,
        account.token,
      ),
    );
  }, [account.token, dispatch, options.fromDate, options.paymentState, options.toDate]);

  useEffect(() => {
    loadData();
  }, [loadData, options.fromDate, options.toDate]);

  const getPrice = ({total_price, total_price_with_vat}) => {
    switch (options.priceDisplay) {
      case EXCLUDING_VAT:
        return parseCurrencyToLocale(locale.languageTag, currency, total_price);
      case INCLUDING_VAT:
        return parseCurrencyToLocale(locale.languageTag, currency, total_price_with_vat);
      default:
        return;
    }
  };

  const renderListItem = ({item}) => (
    <CustomListItem
      title={`${item.year}/${item.month}`}
      rightTitle={getPrice(item)}
      style={styles.listItem}
      bottomDivider
    />
  );

  const getTotalPrice = () => {
    const sumObject = salesByMonthState.rows.reduce((prevValue, nextValue) => ({
      total_price: parseFloat(prevValue.total_price) + parseFloat(nextValue.total_price),
      total_price_with_vat:
        parseFloat(prevValue.total_price_with_vat) + parseFloat(nextValue.total_price_with_vat),
    }));
    switch (options.priceDisplay) {
      case EXCLUDING_VAT:
        return sumObject.total_price;
      case INCLUDING_VAT:
        return sumObject.total_price_with_vat;
      default:
        return;
    }
  };

  const renderContent = () => {
    switch (salesByMonthState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_REPORT} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_REPORT_FAILED}
            onPressButton={loadData}
          />
        );
      case RequestStates.SUCCESS:
        if (!salesByMonthState.rows.length) {
          return (
            <View style={styles.container}>
              <ReportForm formData={options} onChange={setOptions} />
              <EmptyReportNotification />
            </View>
          );
        }
        return (
          <View style={styles.container}>
            <FlatList
              data={salesByMonthState.rows}
              renderItem={renderListItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.scrollContainer}
              ListHeaderComponent={<ReportForm formData={options} onChange={setOptions} />}
              ListFooterComponent={
                <CustomListItem
                  title={Translations.IN_TOTAL}
                  titleStyle={styles.totalPriceText}
                  rightTitle={parseCurrencyToLocale(locale.languageTag, currency, getTotalPrice())}
                  rightTitleStyle={styles.totalPriceText}
                  style={styles.totalListItem}
                  bottomDivider
                />
              }
            />
          </View>
        );
      default:
        return null;
    }
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 48,
  },
  listItem: {
    paddingVertical: 12,
  },
  totalListItem: {
    paddingVertical: 16,
  },
  totalPriceText: {
    fontFamily: Styles.fontBold,
    fontSize: Styles.primaryFontSize + 1,
  },
});
