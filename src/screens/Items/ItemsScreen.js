import React, {useCallback, useEffect, useState} from 'react';

import {View, StyleSheet, Alert, BackHandler} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useFocusEffect} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {fetchItems} from '../../services/store/actions/items/fetchItems';
import {
  filterItemsResetState,
  filterItemsSetCategory,
} from '../../services/store/actions/items/filterItems';
import {fetchCategories} from '../../services/store/actions/items/fetchCategories';
import {deleteItem, deleteItemResetState} from '../../services/store/actions/items/deleteItem';
import Translations from '../../services/localization/Translations';

import RequestStates from '../../constants/States/RequestStates';
import Colors from '../../constants/Colors';
import {successAnimation} from '../../constants/Animations';

import ItemsList from '../../components/Lists/ItemsList';
import FilteringButton from '../../components/Buttons/FilteringButton';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import Loading from '../../components/Indicators/Loading';
import SearchInput from '../../components/Inputs/SearchInput';
import ListingHeaderButtons from '../../components/Buttons/HeaderButtons/ListingHeaderButtons';
import HeaderRightCloseButton from '../../components/Buttons/HeaderButtons/HeaderRightCloseButton';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import System from '../../constants/System';
import HeaderMenuButton from '../../components/Buttons/HeaderButtons/HeaderMenuButton';

export default function ItemsScreen({navigation}) {
  const parentNavigator = navigation.dangerouslyGetParent();

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const items = useSelector((store) => store.fetchItems);
  const fetchCategoriesState = useSelector((store) => store.fetchCategories);
  const filterItems = useSelector((store) => store.filterItems);
  const createItemState = useSelector((store) => store.createItem);
  const editItemState = useSelector((store) => store.editItem);
  const deleteItemState = useSelector((store) => store.deleteItem);

  const successToast = useSelector((store) => store.showToast.successToast);

  const {showActionSheetWithOptions} = useActionSheet();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(null);

  const isFilteringOn = useCallback(() => {
    return filterItems.category !== 'all';
  }, [filterItems.category]);

  const loadData = useCallback(
    (isRefreshing) => {
      let path = '/items';
      if (isFilteringOn()) {
        path = `/categories/${filterItems.category}/items`;
      }
      dispatch(fetchItems(path, account.token, isRefreshing));
      dispatch(fetchCategories(account.token));
    },
    [account.token, dispatch, filterItems.category, isFilteringOn],
  );

  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const setNavParams = useCallback(() => {
    if (parentNavigator) {
      parentNavigator.setOptions({
        headerLeft: () => <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />,
        headerTitle: Translations.ITEMS,
        headerRight: () => <ListingHeaderButtons onCreate={createItem} onSearch={openSearch} />,
      });
    }
  }, [parentNavigator, navigation, createItem, openSearch]);

  const openSearch = useCallback(() => {
    if (parentNavigator) {
      setIsSearchVisible(true);
      parentNavigator.setOptions({
        headerLeft: null,
        headerTitle: () => <SearchInput onEdit={setSearchKeyword} />,
        headerRight: () => <HeaderRightCloseButton onPress={resetSearch} />,
      });
    }
  }, [parentNavigator, resetSearch]);

  const resetSearch = useCallback(() => {
    setSearchKeyword(null);
    setIsSearchVisible(false);
    setNavParams();
  }, [setNavParams]);

  const createItem = useCallback(() => {
    navigation.navigate('CreateItem');
  }, [navigation]);

  const backButtonHandler = useCallback(() => {
    if (isSearchVisible) {
      resetSearch();
      return true;
    } else {
      return false;
    }
  }, [isSearchVisible, resetSearch]);

  useFocusEffect(() => {
    if (System.os === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }
  }, [backButtonHandler]);

  useEffect(() => {
    loadData();
  }, [loadData, filterItems.category]);

  useEffect(() => {
    if (createItemState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [createItemState.state, refresh]);

  useEffect(() => {
    if (editItemState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [editItemState.state, refresh]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setNavParams();
    });
  }, [navigation, setNavParams]);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      if (parentNavigator) {
        parentNavigator.setOptions({
          headerTitle: null,
          headerRight: null,
        });
      }
    });
  }, [parentNavigator, navigation]);

  useEffect(() => {
    if (deleteItemState.state === RequestStates.SUCCESS) {
      dispatch(deleteItemResetState());
      refresh();
      return successToast.show(Translations.DELETE_ITEM_SUCCESS, successAnimation);
    }
  }, [deleteItemState.state, dispatch, refresh, successToast]);

  const shouldRenderFiltering = () => {
    if (isFilteringOn()) {
      return true;
    }
    return fetchCategoriesState.categories.length > 0;
  };

  const showOptions = (item) => {
    const title = item.name;
    const viewOrEdit = `${Translations.VIEW} / ${Translations.EDIT}`;
    const options = [viewOrEdit, Translations.DELETE, Translations.CANCEL];
    const destructiveButtonIndex = options.indexOf(Translations.DELETE);
    const cancelButtonIndex = options.indexOf(Translations.CANCEL);

    const icons = [
      <AntDesignIcon name="eyeo" />,
      <AntDesignIcon name="delete" />,
      <MaterialIcon name="cancel" />,
    ];

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        tintColor: Colors.tintColor,
        icons,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case options.indexOf(viewOrEdit):
            return navigation.navigate('EditItem', {item});
          case options.indexOf(Translations.DELETE):
            return onDelete(item);
          default:
            return;
        }
      },
    );
  };

  const onDelete = (item) => {
    Alert.alert(Translations.DELETE_ITEM, `${Translations.DELETE_ITEM_CONFIRM}?`, [
      {
        text: Translations.CANCEL,
        cancelable: true,
        style: 'cancel',
      },
      {
        text: Translations.OK,
        onPress: () => dispatch(deleteItem(item.id, account.token)),
        style: 'destructive',
      },
    ]);
  };

  const getCategorySelectorData = () => {
    const selectorItems = fetchCategoriesState.categories.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    selectorItems.unshift({
      label: Translations.SHOW_ALL,
      value: 'all',
    });
    return selectorItems;
  };

  const showFiltering = () => {
    navigation.navigate('SelectorScreen', {
      title: Translations.CATEGORY,
      value: filterItems.category,
      onSelect: (category) => dispatch(filterItemsSetCategory(category.value)),
      data: getCategorySelectorData(),
    });
  };

  const isLoading = () => {
    return deleteItemState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    switch (items.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_ITEMS} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_ITEMS_FAILED}
            onPressButton={() => loadData()}
          />
        );
      case RequestStates.REFRESHING:
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <ItemsList
              items={items.items}
              onPressItem={showOptions}
              onRefresh={refresh}
              isRefreshing={items.state === RequestStates.REFRESHING}
              searchKeyword={searchKeyword}
              isFiltering={isFilteringOn()}
              onCreate={createItem}
            />
            {shouldRenderFiltering() && (
              <>
                <FilteringButton
                  onPress={showFiltering}
                  onClear={() => dispatch(filterItemsResetState())}
                  isFiltering={isFilteringOn()}
                />
              </>
            )}
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
});
