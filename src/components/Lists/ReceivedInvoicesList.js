import React, {createRef, useContext, useState} from 'react';

import {FlatList, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';

import {Badge, Button, ListItem} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';
import {
  resetInvoiceAction,
  setInvoicesState,
} from '../../services/store/actions/invoices/invoiceActions';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import Translations from '../../services/localization/Translations';

import {formatToLocaleDate} from '../../utilities/date';
import {parseCurrencyToLocale} from '../../utilities/currencies';

import InvoiceStates from '../../constants/States/InvoiceStates';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

import InvoicesImage from '../../assets/images/features/laskux-kuvitus-ominaisuudet-01.svg';
import MaterialCommunityIcon from '../Icons/MaterialCommunityIcon';
import EmptyListNotification from '../Notifications/EmptyListNotification';
import EmptySearchNotification from '../Notifications/EmptySearchNotification';
import EmptyFilteringNotification from '../Notifications/EmptyFilteringNotificiation';
import PrimaryText from '../Text/PrimaryText';
import CustomDivider from '../Layout/CustomDivider';

export default function ReceivedInvoicesList({
  invoices,
  onRefresh,
  onPressInvoice,
  isRefreshing,
  searchKeyword,
}) {
  const dispatch = useDispatch();
  const invoiceActionsState = useSelector((store) => store.invoiceActions);
  const {locale} = useContext(LocalizationContext);

  const [tabBarScroll, setTabBarScroll] = useState(createRef());

  const handlePress = (invoice) => {
    requestAnimationFrame(() => {
      onPressInvoice(invoice);
    });
  };

  const getInvoiceTitle = ({invoice_number, name}) => {
    let title = name;
    if (invoice_number) {
      title = `${invoice_number} | `.concat(name);
    }
    return title;
  };

  const renderListItem = ({item}) => {
    const {due_date, state, invoice_date, paid_date, total_price, currency} = item;
    const badge = getStateBadge(state);
    return (
      <ListItem
        onPress={() => handlePress(item)}
        containerStyle={styles.listItemContainer}
        title={getInvoiceTitle(item)}
        titleStyle={styles.title}
        titleProps={{numberOfLines: 2}}
        subtitle={
          <>
            <View style={styles.dateLabelContainer}>
              <MaterialCommunityIcon
                name="calendar-blank-outline"
                size={Styles.secondaryFontSize + 1}
                iconStyle={styles.dateIcon}
              />
              <PrimaryText
                text={`${Translations.DATE}: ${formatToLocaleDate(
                  invoice_date,
                  locale.languageCode,
                )}`}
                style={styles.invoiceDateText}
              />
            </View>
            {state === InvoiceStates.PAID || state === InvoiceStates.ARCHIVED ? (
              <View style={styles.dateLabelContainer}>
                <MaterialCommunityIcon
                  name="calendar-check-outline"
                  size={Styles.secondaryFontSize + 1}
                  iconStyle={styles.dateIcon}
                />
                <PrimaryText
                  text={`${Translations.PAID}: ${formatToLocaleDate(
                    paid_date,
                    locale.languageCode,
                  )}`}
                  style={styles.invoiceDateText}
                />
              </View>
            ) : (
              <View style={styles.dateLabelContainer}>
                <MaterialCommunityIcon
                  name="calendar-clock"
                  size={Styles.secondaryFontSize + 1}
                  iconStyle={styles.dateIcon}
                />
                <PrimaryText
                  text={`${Translations.DUE_DATE}: ${formatToLocaleDate(
                    due_date,
                    locale.languageCode,
                  )}`}
                  style={styles.invoiceDateText}
                />
              </View>
            )}
          </>
        }
        rightTitle={parseCurrencyToLocale(locale.languageTag, currency, total_price)}
        rightTitleStyle={styles.rightTitle}
        rightSubtitle={
          <Badge
            value={badge.value}
            textStyle={styles.badgeText}
            badgeStyle={{...styles.badge, backgroundColor: badge.color}}
          />
        }
        chevron={<MaterialCommunityIcon name="dots-vertical" />}
        underlayColor={Colors.tintColor}
      />
    );
  };

  const getStateBadge = (state) => {
    switch (state) {
      case InvoiceStates.OPEN:
        return {
          value: Translations.OPEN,
          color: Colors.tintColor,
        };
      case InvoiceStates.PAID:
        return {
          value: Translations.PAID,
          color: Colors.success,
        };
      case InvoiceStates.ARCHIVED:
        return {
          value: Translations.ARCHIVED,
          color: Colors.success,
        };
      default:
        return;
    }
  };

  const isFilteringOn = () => {
    return invoiceActionsState.subState !== null || invoiceActionsState.customer.id !== null;
  };

  const changeStateTab = (key, index) => {
    requestAnimationFrame(() => {
      dispatch(setInvoicesState({...invoiceActionsState, dynamicState: key, subState: null}));
    });
    if (tabBarScroll) {
      tabBarScroll.scrollTo({x: (Layout.window.width / 6) * index, y: 0, animated: true});
    }
  };

  const renderTabButtons = () => {
    const states = [
      {key: InvoiceStates.ALL, title: Translations.ALL},
      {key: InvoiceStates.OPEN, title: Translations.OPEN},
      {key: InvoiceStates.PAID, title: Translations.PAID},
      {key: InvoiceStates.ARCHIVED, title: Translations.ARCHIVED},
    ];
    const buttons = [];
    for (const state in invoices) {
      if (invoices.hasOwnProperty(state)) {
        if (invoices[state].length > 0) {
          buttons.push(states.find((stateToFind) => stateToFind.key === state));
        }
      }
    }
    const buttonsWidth = buttons.length > 2 ? Layout.window.width / 3 : Layout.window.width / 2;
    return buttons.map((button, index) => {
      const isActive = button.key === invoiceActionsState.dynamicState;
      return (
        <Button
          title={button.title}
          titleStyle={{...styles.tabButtonTitle, ...(isActive && styles.activeTabTitle)}}
          titleProps={{numberOfLines: 1}}
          containerStyle={{
            ...styles.tabButtonContainer,
            ...(isActive && styles.activeTabContainer),
          }}
          buttonStyle={{...styles.tabButton, width: buttonsWidth}}
          key={index}
          onPress={() => changeStateTab(button.key, index)}
        />
      );
    });
  };

  const getItemLayout = (data, index) => {
    return {length: 90, offset: 90 * index, index};
  };

  const getDataByState = () => {
    if (invoices.all.length > 0) {
      if (invoices[invoiceActionsState.dynamicState].length < 1) {
        dispatch(resetInvoiceAction());
      }
    }
    switch (invoiceActionsState.dynamicState) {
      case InvoiceStates.ALL:
        return invoices.all;
      case InvoiceStates.OPEN:
        return invoices.open;
      case InvoiceStates.PAID:
        return invoices.paid;
      case InvoiceStates.ARCHIVED:
        return invoices.archived;
      default:
        return [];
    }
  };

  const renderList = () => {
    let data = getDataByState();
    if (invoiceActionsState.customer.id) {
      data = data.filter((invoice) => {
        return invoice.customer.id === invoiceActionsState.customer.id;
      });
    }
    if (searchKeyword) {
      data = data.filter(({name, invoice_number, reference_number}) => {
        const keyword = searchKeyword.toUpperCase();
        return (
          (name && name.toUpperCase().includes(keyword)) ||
          (invoice_number && invoice_number.toString().includes(keyword)) ||
          (reference_number && reference_number.toString().includes(keyword))
        );
      });
    }
    if (data.length < 1) {
      if (searchKeyword) {
        return <EmptySearchNotification />;
      } else if (isFilteringOn()) {
        return <EmptyFilteringNotification text={Translations.NO_INVOICES_WITH_PARAMETERS} />;
      }
    }
    return (
      <FlatList
        data={data}
        style={styles.container}
        initialNumToRender={10}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        getItemLayout={getItemLayout}
        refreshing={isRefreshing}
        renderItem={renderListItem}
        keyExtractor={({id}) => id}
        ListHeaderComponent={<CustomDivider margin={0} />}
      />
    );
  };

  const renderContent = () => {
    if (invoices.all.length < 1) {
      return (
        <ScrollView
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.container}>
          <EmptyListNotification
            text={Translations.NO_RECEIVED_INVOICES}
            image={<InvoicesImage width={Layout.window.width} height="40%" />}
          />
        </ScrollView>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.tabBarWrapper}>
          <ScrollView
            horizontal={true}
            ref={setTabBarScroll}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBarContainer}>
            {renderTabButtons()}
          </ScrollView>
        </View>
        {renderList()}
      </View>
    );
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarWrapper: {
    backgroundColor: Colors.white,
    width: '100%',
  },
  tabBarContainer: {
    minWidth: '100%',
  },
  tabButton: {
    backgroundColor: Colors.white,
    borderRadius: 0,
    paddingVertical: 12,
  },
  tabButtonContainer: {
    borderRadius: 0,
    borderBottomColor: Colors.border,
    borderStyle: 'solid',
    borderBottomWidth: 2,
  },
  activeTabContainer: {
    borderBottomColor: Colors.tintColor,
  },
  tabButtonTitle: {
    color: Colors.deepBlue,
    fontFamily: Styles.fontSemiBold,
    fontSize: Styles.headerFontSize,
    textTransform: 'capitalize',
  },
  activeTabTitle: {
    color: Colors.tintColor,
  },
  listItemContainer: {
    minHeight: 90,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderStyle: 'solid',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  title: {
    marginBottom: 6,
  },
  invoiceDateText: {
    fontSize: Styles.secondaryFontSize,
  },
  rightTitle: {
    marginBottom: 12,
  },
  badge: {
    borderRadius: 24,
    height: 24,
    minWidth: 90,
  },
  badgeText: {
    fontSize: Styles.secondaryFontSize,
    fontFamily: Styles.fontSemiBold,
    textTransform: 'capitalize',
  },
  dateLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateIcon: {
    marginRight: 7,
  },
});
