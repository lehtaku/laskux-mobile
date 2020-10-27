import React, {useState} from 'react';

import {StyleSheet} from 'react-native';

import Translations from '../../services/localization/Translations';

import {Button, Overlay} from 'react-native-elements';

import CustomersList from '../Lists/CustomersList';
import CustomDivider from '../Layout/CustomDivider';
import Loading from '../Indicators/Loading';
import CustomSearchBar from '../Layout/CustomSearchBar';
import VerticalSafeAreaContainer from '../Layout/VerticalSafeAreaContainer';

export default function CustomerSelector({
  isVisible,
  isLoading,
  isRefreshing,
  onCancel,
  onRefresh,
  customers,
  onSelect,
  onCreate,
}) {
  const [searchKeyword, setSearchKeyword] = useState(null);

  const renderContent = () => {
    if (isLoading) {
      return <Loading text={Translations.LOADING_CUSTOMERS} />;
    }
    return (
      <CustomersList
        customers={customers}
        searchKeyword={searchKeyword}
        isRefreshing={isRefreshing}
        onPressCustomer={onSelect}
        onRefresh={onRefresh}
        onCreate={onCreate}
      />
    );
  };

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onCancel}
      overlayStyle={styles.overlay}
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
