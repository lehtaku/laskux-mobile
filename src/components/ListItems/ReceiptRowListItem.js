import React, {useContext} from 'react';

import {StyleSheet, View} from 'react-native';

import {useSelector} from 'react-redux';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {getPriceWithoutVat, getPriceWithVat} from '../../utilities/calculation';
import Translations from '../../services/localization/Translations';

import {VAT_VALUES} from '../../constants/Params/ItemParams';
import {EXCLUDING_VAT, INCLUDING_VAT} from '../../constants/Params/ItemParams';

import CustomListItem from './CustomListItem';
import NumberInput from '../Inputs/NumberInput';
import SelectorInput from '../Inputs/SelectorInput';

export default function ReceiptRowListItem({
  item,
  onChange,
  onDelete,
  autoFocus,
  onPressSelectVat,
}) {
  const accountDetails = useSelector((store) => store.fetchAccountDetails);

  const {currency} = useContext(LocalizationContext);

  const emitChanges = (newData) => {
    onChange({...item, ...newData});
  };

  const getPrice = () => {
    switch (accountDetails.settings.items.vat_type) {
      case EXCLUDING_VAT:
        return item.gross_amount;
      case INCLUDING_VAT:
        return item.net_amount;
      default:
        return;
    }
  };

  const priceHandler = (inputPrice) => {
    switch (accountDetails.settings.items.vat_type) {
      case EXCLUDING_VAT:
        return emitChanges({
          gross_amount: inputPrice,
          net_amount: getPriceWithVat(inputPrice, item.vat_percent),
        });
      case INCLUDING_VAT:
        return emitChanges({
          gross_amount: getPriceWithoutVat(inputPrice, item.vat_percent),
          net_amount: inputPrice,
        });
      default:
        return;
    }
  };

  const vatHandler = (vatPercent) => {
    switch (accountDetails.settings.items.vat_type) {
      case EXCLUDING_VAT:
        return emitChanges({
          vat_percent: vatPercent,
          net_amount: getPriceWithVat(item.gross_amount, vatPercent),
        });
      case INCLUDING_VAT:
        return emitChanges({
          vat_percent: vatPercent,
          gross_amount: getPriceWithoutVat(item.net_amount, vatPercent),
        });
      default:
        return;
    }
  };

  const renderVatInput = () => {
    return (
      <View style={styles.vatInputContainer}>
        <SelectorInput
          data={VAT_VALUES}
          onSelect={vatHandler}
          value={item.vat_percent}
          label={Translations.VAT}
          onPress={onPressSelectVat}
          placeholder={Translations.SELECT_VAT}
          shrink
        />
      </View>
    );
  };

  const renderAmountInput = () => {
    return (
      <View style={styles.amountInputContainer}>
        <NumberInput
          value={getPrice()}
          onEdit={priceHandler}
          badgeValue={currency}
          label={Translations.SUM}
          autoFocus={autoFocus}
          shrink
        />
      </View>
    );
  };

  return (
    <CustomListItem
      title={renderVatInput()}
      subtitle={renderAmountInput()}
      style={styles.container}
      onPressDelete={onDelete}
      bottomDivider
    />
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    paddingBottom: 18,
    paddingTop: 12,
  },
  vatInputContainer: {
    minWidth: '100%',
  },
  amountInputContainer: {
    minWidth: '100%',
    marginTop: 16,
  },
});
