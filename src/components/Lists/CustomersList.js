import React from 'react';

import {View, FlatList, StyleSheet, RefreshControl, ScrollView} from 'react-native';

import {ListItem} from 'react-native-elements';

import {getFirstLetter} from '../../utilities/stringHandling';
import Translations from '../../services/localization/Translations';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import CustomersImage from '../../assets/images/features/laskux-kuvitus-ominaisuudet-06.svg';
import ListItemDivider from '../ListItems/ListItemDivider';
import EntypoIcon from '../Icons/EntypoIcon';
import EmptyListNotification from '../Notifications/EmptyListNotification';
import EmptySearchNotification from '../Notifications/EmptySearchNotification';
import EmptyFilteringNotification from '../Notifications/EmptyFilteringNotificiation';
import CustomDivider from '../Layout/CustomDivider';

export default function CustomersList({
  customers,
  onRefresh,
  isRefreshing,
  onPressCustomer,
  searchKeyword,
  onCreate,
  isFiltering,
}) {
  const handlePress = (customer) => {
    requestAnimationFrame(() => {
      onPressCustomer(customer);
    });
  };

  const renderListItem = ({item, index}) => (
    <>
      {customers.length > 20 && getDivider(index)}
      <ListItem
        onPress={() => handlePress(item)}
        title={item.name}
        titleProps={{numberOfLines: 2}}
        containerStyle={styles.listItemContainer}
        underlayColor={Colors.tintColor}
        chevron={<EntypoIcon name="chevron-small-right" />}
      />
    </>
  );

  const getDivider = (index) => {
    const prevLetter = customers[index - 1] ? getFirstLetter(customers[index - 1].name) : '';
    const currentLetter = getFirstLetter(customers[index].name);
    if (prevLetter !== currentLetter) {
      return <ListItemDivider title={getFirstLetter(customers[index].name)} />;
    }
  };

  const getItemLayout = (data, index) => {
    return {length: 60, offset: 60 * index, index};
  };

  const getListData = () => {
    if (searchKeyword) {
      return customers.filter((customer) => {
        const keyword = searchKeyword.toUpperCase();
        return (
          (customer.name && customer.name.toUpperCase().includes(keyword)) ||
          (customer.email && customer.email.toUpperCase().includes(keyword))
        );
      });
    }
    return customers;
  };

  const renderContent = () => {
    const data = getListData();
    if (data.length < 1) {
      if (searchKeyword) {
        return <EmptySearchNotification />;
      } else if (isFiltering) {
        return <EmptyFilteringNotification text={Translations.EMPTY_CUSTOMER_GROUP} />;
      }
      return (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
          <EmptyListNotification
            text={Translations.NO_CUSTOMERS}
            buttonTitle={Translations.CREATE_CUSTOMER}
            image={<CustomersImage width={Layout.window.width} height="40%" />}
            onPressButton={onCreate}
          />
        </ScrollView>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          initialNumToRender={10}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          refreshing={isRefreshing}
          getItemLayout={getItemLayout}
          renderItem={renderListItem}
          keyExtractor={({id}) => id}
          ListHeaderComponent={<CustomDivider margin={0} />}
        />
      </View>
    );
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemContainer: {
    minHeight: 60,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderStyle: 'solid',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
});
