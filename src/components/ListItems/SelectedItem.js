import React, {useContext} from 'react';

import {StyleSheet, View} from 'react-native';

import {useSelector} from 'react-redux';

import {useActionSheet} from '@expo/react-native-action-sheet';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import Translations from '../../services/localization/Translations';

import {Button} from 'react-native-elements';
import {parseCurrencyToLocale} from '../../utilities/currencies';

import MaterialCommunityIcon from '../Icons/MaterialCommunityIcon';
import EntypoIcon from '../Icons/EntypoIcon';
import AntDesignIcon from '../Icons/AntDesignIcon';
import MaterialIcon from '../Icons/MaterialIcon';
import CustomListItem from './CustomListItem';
import DateSelectorInput from '../Inputs/DateSelectorInput';
import NumberInput from '../Inputs/NumberInput';

export default function SelectedItem({
  item,
  onDelete,
  onEdit,
  onQuantityChange,
  onSelectDate,
  autoFocus,
}) {
  const accountDetails = useSelector((store) => store.fetchAccountDetails);

  const {showActionSheetWithOptions} = useActionSheet();
  const {currency, locale} = useContext(LocalizationContext);

  const showOptions = () => {
    const options = [Translations.EDIT, Translations.DELETE_INVOICE_LINE, Translations.CANCEL];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    const icons = [
      <EntypoIcon name="edit" />,
      <AntDesignIcon name="delete" />,
      <MaterialIcon name="cancel" />,
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return onEdit();
          case 1:
            return onDelete();
          case 2:
            return;
          default:
            return;
        }
      },
    );
  };

  const renderInputs = () => {
    return (
      <View style={styles.inputsContainer}>
        <View style={styles.quantityInputContainer}>
          <NumberInput
            value={item.quantity}
            onEdit={onQuantityChange}
            badgeValue={Translations.ITEM_UNITS[item.unit.toUpperCase()].ABBREVIATION}
            autoFocus={autoFocus}
            shrink
          />
        </View>
        {accountDetails.settings.invoices.item_dates && (
          <View style={styles.dateInputContainer}>
            <DateSelectorInput value={item.date} onSelect={onSelectDate} shrink />
          </View>
        )}
      </View>
    );
  };

  return (
    <CustomListItem
      style={styles.container}
      title={item.name}
      subtitle={renderInputs()}
      rightTitle={parseCurrencyToLocale(locale.languageTag, currency, item.price_with_vat)}
      rightSubtitle={`${Translations.VAT} ${item.vat_percent} %`}
      rightIcon={
        <Button
          containerStyle={styles.optionsButtonContainer}
          icon={<MaterialCommunityIcon name="dots-vertical" />}
          onPress={showOptions}
          buttonStyle={styles.optionsButton}
        />
      }
      topDivider
    />
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    paddingVertical: 12,
  },
  inputsContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: 8,
  },
  quantityInputContainer: {
    minWidth: '45%',
    maxWidth: '60%',
    flex: 1,
    marginRight: 16,
  },
  dateInputContainer: {
    minWidth: '55%',
  },
  optionsButtonContainer: {
    justifyContent: 'center',
  },
  optionsButton: {
    backgroundColor: 'transparent',
    padding: 0,
  },
});
