import React, {useCallback, useEffect, useState} from 'react';

import {BackHandler, FlatList, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import Translations from '../../services/localization/Translations';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import System from '../../constants/System';

import CustomListItem from '../../components/ListItems/CustomListItem';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import BottomSafeAreaContainer from '../../components/Layout/BottomSafeAreaContainer';
import CustomDivider from '../../components/Layout/CustomDivider';
import CustomSearchBar from '../../components/Layout/CustomSearchBar';

export default function SelectorScreen({navigation, route}) {
  const title = route.params?.title;
  const data = route.params?.data;
  const value = route.params?.value;
  const onSelect = route.params?.onSelect;
  const iconType = route.params?.iconType;
  const showSearch = route.params?.showSearch;

  const [searchKeyword, setSearchKeyword] = useState(null);

  const backButtonHandler = useCallback(() => {
    navigation.goBack();
    return true;
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [title, navigation]);

  useFocusEffect(() => {
    if (System.os === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }
  }, [backButtonHandler]);

  const handlePress = (item) => {
    if (onSelect) {
      onSelect(item);
      navigation.goBack();
    }
  };

  const getItemLayout = (itemData, index) => {
    return {length: 55, offset: 55 * index, index};
  };

  const renderRightIcon = (itemValue) => {
    if (itemValue === value) {
      return <AntDesignIcon name="check" color={Colors.tintColor} />;
    } else if (iconType === 'plus') {
      return <AntDesignIcon name="plus" />;
    } else if (iconType === 'chevron') {
      return <AntDesignIcon name="right" size={18} />;
    }
  };

  const getPlaceHolderStyle = () => {
    return {
      fontFamily: Styles.fontRegular,
    };
  };

  const renderListItem = ({item}) => {
    return (
      <CustomListItem
        onPress={() => handlePress(item)}
        title={item.label}
        titleProps={{numberOfLines: 1}}
        titleStyle={!item.value && getPlaceHolderStyle()}
        subtitle={item.description}
        subtitleStyle={styles.subtitle}
        style={styles.listItemContainer}
        rightIcon={renderRightIcon(item.value)}
        disabled={item.disabled}
        bottomDivider
      />
    );
  };

  const getData = () => {
    if (searchKeyword) {
      const keyword = searchKeyword.toUpperCase();
      return data.filter((item) => item.label.toUpperCase().includes(keyword));
    }
    return data;
  };

  return (
    <BottomSafeAreaContainer>
      {showSearch && (
        <CustomSearchBar
          placeholder={Translations.SEARCH_OR_ENTER_NEW}
          value={searchKeyword}
          onSearch={setSearchKeyword}
          onSubmit={() => handlePress({label: null, value: searchKeyword})}
          returnKeyType="done"
        />
      )}
      <FlatList
        data={getData()}
        renderItem={renderListItem}
        getItemLayout={getItemLayout}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={15}
        ListHeaderComponent={<CustomDivider margin={0} />}
      />
    </BottomSafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    height: 55,
    paddingVertical: 0,
  },
  subtitle: {
    color: Colors.black,
    marginTop: 4,
  },
});
