import React, {useContext} from 'react';

import {FlatList, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';

import {Badge, ListItem} from 'react-native-elements';

import {LocalizationContext} from '../../services/localization/LocalizationContext';
import Translations from '../../services/localization/Translations';

import {formatToLocaleDate} from '../../utilities/date';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import OfferStates from '../../constants/States/OfferStates';

import ReceiptsImage from '../../assets/images/features/laskux-kuvitus-ominaisuudet-07.svg';
import MaterialCommunityIcon from '../Icons/MaterialCommunityIcon';
import EmptyListNotification from '../Notifications/EmptyListNotification';
import EmptySearchNotification from '../Notifications/EmptySearchNotification';
import PrimaryText from '../Text/PrimaryText';
import CustomDivider from '../Layout/CustomDivider';
import {parseCurrencyToLocale} from '../../utilities/currencies';

export default function OffersList({
  offers,
  onRefresh,
  onPressOffer,
  isRefreshing,
  searchKeyword,
  onCreate,
}) {
  const {locale, currency} = useContext(LocalizationContext);

  const handlePress = (offer) => {
    requestAnimationFrame(() => {
      onPressOffer(offer);
    });
  };

  const renderListItem = ({item}) => {
    const {state, customer, offer_date, valid_to, total_price_with_vat, offer_number} = item;
    const badge = getTypeBadge(state);
    return (
      <ListItem
        title={`${offer_number} | ${customer.name}`}
        containerStyle={styles.listItemContainer}
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
                text={`${Translations.CREATED}: ${formatToLocaleDate(
                  offer_date,
                  locale.languageCode,
                )}`}
                style={styles.invoiceDateText}
              />
            </View>
            {valid_to && (
              <View style={styles.dateLabelContainer}>
                <MaterialCommunityIcon
                  name="calendar-clock"
                  size={Styles.secondaryFontSize + 1}
                  iconStyle={styles.dateIcon}
                />
                <PrimaryText
                  text={`${Translations.VALID_TO}: ${formatToLocaleDate(
                    valid_to,
                    locale.languageCode,
                  )}`}
                  style={styles.invoiceDateText}
                />
              </View>
            )}
          </>
        }
        onPress={() => handlePress(item)}
        rightTitle={parseCurrencyToLocale(locale.languageTag, currency, total_price_with_vat)}
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

  const getTypeBadge = (state) => {
    switch (state) {
      case OfferStates.DRAFT:
        return {
          value: Translations.DRAFT,
          color: Colors.black,
        };
      case OfferStates.APPROVED:
        return {
          value: Translations.APPROVED,
          color: Colors.success,
        };
      case OfferStates.SENT:
        return {
          value: Translations.SENT,
          color: Colors.tintColor,
        };
      default:
        return;
    }
  };

  const getItemLayout = (data, index) => {
    return {length: 80, offset: 90 * index, index};
  };

  const renderList = () => {
    let data = offers;
    if (searchKeyword) {
      data = data.filter(({customer}) => {
        const keyword = searchKeyword.toUpperCase();
        return (
          (customer.name && customer.name.toUpperCase().includes(keyword)) ||
          (customer.email && customer.email.toUpperCase().includes(keyword))
        );
      });
    }
    if (data.length < 1) {
      if (searchKeyword) {
        return <EmptySearchNotification />;
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
    if (offers.length < 1) {
      return (
        <ScrollView
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.container}>
          <EmptyListNotification
            text={Translations.NO_OFFERS}
            image={<ReceiptsImage width={Layout.window.width} height="40%" />}
            buttonTitle={Translations.CREATE_OFFER}
            onPressButton={onCreate}
          />
        </ScrollView>
      );
    }
    return <View style={styles.container}>{renderList()}</View>;
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
    minHeight: 80,
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
