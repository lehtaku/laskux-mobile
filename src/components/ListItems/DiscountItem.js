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
import PlainTextInput from '../Inputs/PlainTextInput';

export default function DiscountItem({item, onChange, onDelete, autoFocus, onPressSelectVat}) {
  const accountDetails = useSelector((store) => store.fetchAccountDetails);

  const {currency} = useContext(LocalizationContext);

  const emitChanges = (newData) => {
    onChange({...item, ...newData});
  };

  const getPrice = () => {
    switch (accountDetails.settings.items.vat_type) {
      case EXCLUDING_VAT:
        return item.price;
      case INCLUDING_VAT:
        return item.price_with_vat;
      default:
        return;
    }
  };

  const priceHandler = (inputPrice) => {
    switch (accountDetails.settings.items.vat_type) {
      case EXCLUDING_VAT:
        return emitChanges({
          price: inputPrice,
          price_with_vat: getPriceWithVat(inputPrice, item.vat_percent),
        });
      case INCLUDING_VAT:
        return emitChanges({
          price: getPriceWithoutVat(inputPrice, item.vat_percent),
          price_with_vat: inputPrice,
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
          price_with_vat: getPriceWithVat(item.price, vatPercent),
        });
      case INCLUDING_VAT:
        return emitChanges({
          vat_percent: vatPercent,
          price: getPriceWithoutVat(item.price_with_vat, vatPercent),
        });
      default:
        return;
    }
  };

  const renderInputs = () => {
    return (
      <View style={styles.inputsContainer}>
        <View style={styles.nameInputContainer}>
          <PlainTextInput
            label={Translations.NAME}
            value={item.name}
            onEdit={(value) => emitChanges({name: value})}
            shrink
          />
        </View>
        <View style={styles.vatInputContainer}>
          <SelectorInput
            data={VAT_VALUES}
            onSelect={vatHandler}
            value={item.vat_percent}
            label={Translations.VAT}
            onPress={onPressSelectVat}
            shrink
          />
        </View>
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
      title={renderInputs()}
      subtitle={renderAmountInput()}
      style={styles.container}
      onPressDelete={onDelete}
      topDivider
    />
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    paddingBottom: 16,
    paddingTop: 9,
  },
  inputsContainer: {
    flexDirection: 'row',
  },
  nameInputContainer: {
    flex: 1,
    marginRight: 16,
  },
  vatInputContainer: {
    flex: 1,
  },
  amountInputContainer: {
    minWidth: '100%',
    marginTop: 8,
  },
});
