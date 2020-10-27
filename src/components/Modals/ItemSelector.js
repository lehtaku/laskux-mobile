import React, {useState} from 'react';

import {StyleSheet} from 'react-native';

import {Button, Overlay} from 'react-native-elements';
import Translations from '../../services/localization/Translations';

import ItemsList from '../Lists/ItemsList';
import CustomDivider from '../Layout/CustomDivider';
import Loading from '../Indicators/Loading';
import CustomSearchBar from '../Layout/CustomSearchBar';
import VerticalSafeAreaContainer from '../Layout/VerticalSafeAreaContainer';

export default function ItemSelector({
  isVisible,
  isLoading,
  isRefreshing,
  onCancel,
  onRefresh,
  onSelect,
  items,
  onCreate,
}) {
  const [searchKeyword, setSearchKeyword] = useState(null);

  const renderContent = () => {
    if (isLoading) {
      return <Loading text={Translations.LOADING_ITEMS} />;
    }
    return (
      <ItemsList
        items={items}
        onPressItem={onSelect}
        isRefreshing={isRefreshing}
        searchKeyword={searchKeyword}
        onRefresh={onRefresh}
        onCreate={onCreate}
      />
    );
  };

  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
      onBackdropPress={onCancel}
      fullScreen={true}
      animationType="fade">
      <VerticalSafeAreaContainer>
        <CustomSearchBar
          placeholder={Translations.SEARCH}
          value={searchKeyword}
          onSearch={setSearchKeyword}
        />
        {renderContent()}
        <CustomDivider margin={0} />
        <Button
          title={Translations.CLOSE}
          containerStyle={styles.cancelButtonContainer}
          buttonStyle={styles.cancelButton}
          onPress={onCancel}
        />
      </VerticalSafeAreaContainer>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cancelButtonContainer: {
    marginVertical: 16,
    marginHorizontal: 12,
  },
  cancelButton: {
    paddingVertical: 12,
  },
});
