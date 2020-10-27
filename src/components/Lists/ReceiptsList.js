import React, {useContext, useEffect} from 'react';

import {FlatList, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';

import {Badge, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

import {LocalizationContext} from '../../services/localization/LocalizationContext';
import Translations from '../../services/localization/Translations';

import {formatToLocaleDate} from '../../utilities/date';
import {parseCurrencyToLocale} from '../../utilities/currencies';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import {RECEIPT_TYPES} from '../../constants/Types/ReceiptTypes';

import ReceiptsImage from '../../assets/images/features/laskux-kuvitus-ominaisuudet-07.svg';
import MaterialCommunityIcon from '../Icons/MaterialCommunityIcon';
import EmptyListNotification from '../Notifications/EmptyListNotification';
import EmptySearchNotification from '../Notifications/EmptySearchNotification';
import PrimaryText from '../Text/PrimaryText';
import CustomDivider from '../Layout/CustomDivider';
import {fetchSellers} from '../../services/store/actions/sellers/fetchSellers';

export default function ReceiptsList({
  receipts,
  onRefresh,
  onPressReceipt,
  isRefreshing,
  searchKeyword,
  onAddReceipt,
}) {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const fetchSellersState = useSelector((store) => store.fetchSellers);
  const {locale, currency} = useContext(LocalizationContext);

  const handlePress = (receipt) => {
    requestAnimationFrame(() => {
      onPressReceipt(receipt);
    });
  };

  useEffect(() => {
    dispatch(fetchSellers(account.token));
  }, [account.token, dispatch]);

  const renderListItem = ({item}) => {
    const {type, total_gross_amount, total_net_amount, receipt_date, seller_id} = item;
    const seller = fetchSellersState.sellers.find((sellerToFind) => sellerToFind.id === seller_id);
    const name = seller ? seller.name : '-';
    const badge = getTypeBadge(type);
    return (
      <ListItem
        title={name}
        containerStyle={styles.listItemContainer}
        titleStyle={styles.title}
        titleProps={{numberOfLines: 2}}
        onPress={() => handlePress(item)}
        subtitle={
          <View style={styles.dateLabelContainer}>
            <MaterialCommunityIcon
              name="calendar-blank-outline"
              size={Styles.secondaryFontSize + 1}
              iconStyle={styles.dateIcon}
            />
            <PrimaryText
              text={`${Translations.CREATED}: ${formatToLocaleDate(
                receipt_date,
                locale.languageCode,
              )}`}
              style={styles.invoiceDateText}
            />
          </View>
        }
        rightTitle={parseCurrencyToLocale(
          locale.languageTag,
          currency,
          type === RECEIPT_TYPES.LOSS ? total_gross_amount : total_net_amount,
        )}
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

  const getTypeBadge = (type) => {
    switch (type) {
      case RECEIPT_TYPES.LOSS:
        return {
          value: Translations.LOSS,
          color: Colors.tintColor,
        };
      case RECEIPT_TYPES.PROFIT:
        return {
          value: Translations.PROFIT,
          color: Colors.success,
        };
      default:
        return;
    }
  };

  const getItemLayout = (data, index) => {
    return {length: 80, offset: 90 * index, index};
  };

  const renderList = () => {
    let data = receipts;
    if (searchKeyword) {
      data = data.filter(({description, seller_id}) => {
        const keyword = searchKeyword.toUpperCase();
        const seller = fetchSellersState.sellers.find(({id}) => id === seller_id);
        return (
          (description && description.toUpperCase().includes(keyword)) ||
          (seller.name && seller.name.toUpperCase().includes(keyword))
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
    if (receipts.length < 1) {
      return (
        <ScrollView
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.container}>
          <EmptyListNotification
            text={Translations.NO_RECEIPTS}
            image={<ReceiptsImage width={Layout.window.width} height="40%" />}
            buttonTitle={Translations.ADD_RECEIPT}
            onPressButton={onAddReceipt}
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
