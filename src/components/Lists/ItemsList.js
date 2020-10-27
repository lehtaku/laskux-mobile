import React, {useContext} from 'react';

import {View, FlatList, StyleSheet, RefreshControl, ScrollView} from 'react-native';

import {ListItem} from 'react-native-elements';

import {getFirstLetter} from '../../utilities/stringHandling';
import {parseCurrencyToLocale} from '../../utilities/currencies';
import Translations from '../../services/localization/Translations';
import {LocalizationContext} from '../../services/localization/LocalizationContext';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import ItemsImage from '../../assets/images/features/laskux-kuvitus-ominaisuudet-05.svg';
import ListItemDivider from '../ListItems/ListItemDivider';
import EntypoIcon from '../Icons/EntypoIcon';
import EmptyListNotification from '../Notifications/EmptyListNotification';
import EmptySearchNotification from '../Notifications/EmptySearchNotification';
import EmptyFilteringNotification from '../Notifications/EmptyFilteringNotificiation';
import CustomDivider from '../Layout/CustomDivider';

export default function ItemsList({
  items,
  onRefresh,
  isRefreshing,
  onPressItem,
  onCreate,
  isFiltering,
  searchKeyword,
}) {
  const {locale, currency} = useContext(LocalizationContext);

  const handlePress = (item) => {
    requestAnimationFrame(() => {
      onPressItem(item);
    });
  };

  const renderListItem = ({item, index}) => {
    return (
      <>
        {items.length > 20 && getDivider(index)}
        <ListItem
          onPress={() => handlePress(item)}
          title={item.name}
          titleProps={{numberOfLines: 2}}
          containerStyle={styles.listItemContainer}
          rightTitle={parseCurrencyToLocale(locale.languageTag, currency, item.price_with_vat)}
          underlayColor={Colors.tintColor}
          chevron={<EntypoIcon name="chevron-small-right" />}
        />
      </>
    );
  };

  const getDivider = (index) => {
    const prevLetter = items[index - 1] ? getFirstLetter(items[index - 1].name) : '';
    const currentLetter = getFirstLetter(items[index].name);
    if (prevLetter !== currentLetter) {
      return <ListItemDivider title={getFirstLetter(items[index].name)} />;
    }
  };

  const getItemLayout = (data, index) => {
    return {length: 60, offset: 60 * index, index};
  };

  const getListData = () => {
    if (searchKeyword) {
      return items.filter((item) => {
        const keyword = searchKeyword.toUpperCase();
        return (
          (item.name && item.name.toUpperCase().includes(keyword)) ||
          (item.unit && item.unit.toUpperCase().includes(keyword))
        );
      });
    }
    return items;
  };

  const renderData = () => {
    const data = getListData();
    if (data.length < 1) {
      if (searchKeyword) {
        return <EmptySearchNotification />;
      } else if (isFiltering) {
        return <EmptyFilteringNotification text={Translations.EMPTY_ITEM_CATEGORY} />;
      }
      return (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
          <EmptyListNotification
            text={Translations.NO_ITEMS}
            buttonTitle={Translations.CREATE_ITEM}
            image={<ItemsImage width={Layout.window.width} height="40%" />}
            onPressButton={onCreate}
          />
        </ScrollView>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          getItemLayout={getItemLayout}
          refreshing={isRefreshing}
          initialNumToRender={10}
          renderItem={renderListItem}
          keyExtractor={({id}) => id}
          ListHeaderComponent={<CustomDivider margin={0} />}
        />
      </View>
    );
  };

  return renderData();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemContainer: {
    minHeight: 60,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderStyle: 'solid',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
});
