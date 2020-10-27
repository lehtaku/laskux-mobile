import React, {useCallback, useContext, useEffect, useState} from 'react';

import {FlatList, StyleSheet, View} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {fetchSalesReport} from '../../services/store/actions/reports/salesReport';
import Translations from '../../services/localization/Translations';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {parseCurrencyToLocale} from '../../utilities/currencies';
import {
  formatDateYYYYMMDD,
  formatToLocaleDate,
  getDateFromBeginningOfYear,
} from '../../utilities/date';

import RequestStates from '../../constants/States/RequestStates';
import Styles from '../../constants/Styles';
import InvoiceStates from '../../constants/States/InvoiceStates';
import {EXCLUDING_VAT, INCLUDING_VAT} from '../../constants/Params/ItemParams';

import CustomListItem from '../../components/ListItems/CustomListItem';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import EmptyReportNotification from '../../components/Notifications/EmptyReportNotification';
import ReportForm from '../../components/Forms/ReportForm';

export default function SalesReportScreen() {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const salesReportState = useSelector((store) => store.salesReport);

  const [options, setOptions] = useState({
    fromDate: getDateFromBeginningOfYear(),
    toDate: new Date(),
    paymentState: InvoiceStates.ALL,
    priceDisplay: EXCLUDING_VAT,
  });

  const {locale, currency} = useContext(LocalizationContext);

  const loadData = useCallback(() => {
    dispatch(
      fetchSalesReport(
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

  const renderListItem = ({item}) => {
    return (
      <CustomListItem
        title={`${item.invoice_number} | ${item.name}`}
        subtitle={`${Translations.PAID}: ${formatToLocaleDate(
          item.invoice_date,
          locale.languageCode,
        )}`}
        rightTitle={getPrice(item)}
        style={styles.listItem}
        bottomDivider
      />
    );
  };

  const getTotalPrice = () => {
    const sumObject = salesReportState.rows.reduce((prevValue, nextValue) => ({
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
    switch (salesReportState.state) {
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
        if (!salesReportState.rows.length) {
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
              data={salesReportState.rows}
              renderItem={renderListItem}
              keyExtractor={({invoice_id}) => invoice_id}
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
    paddingVertical: 24,
  },
  totalPriceText: {
    fontFamily: Styles.fontBold,
    fontSize: Styles.primaryFontSize + 1,
  },
});
