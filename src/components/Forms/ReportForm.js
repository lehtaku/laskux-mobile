import React, {useState} from 'react';

import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Translations from '../../services/localization/Translations';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import {EXCLUDING_VAT, INCLUDING_VAT} from '../../constants/Params/ItemParams';

import DateSelectorInput from '../Inputs/DateSelectorInput';
import CustomButtonGroup from '../Buttons/CustomButtonGroup';
import ListItemDivider from '../ListItems/ListItemDivider';
import SelectorInput from '../Inputs/SelectorInput';
import InvoiceStates from '../../constants/States/InvoiceStates';

export default function ReportForm({formData, onChange}) {
  const navigation = useNavigation();
  const [priceTypeButtonIndex, setPriceTypeButtonIndex] = useState(0);

  const emitChanges = (newData) => {
    onChange((data) => ({
      ...data,
      ...newData,
    }));
  };

  const openSelector = (params) => {
    navigation.navigate('SelectorScreen', params);
  };

  const changePriceToShow = (buttonIndex) => {
    setPriceTypeButtonIndex(buttonIndex);
    switch (buttonIndex) {
      case 0:
        return emitChanges({priceDisplay: EXCLUDING_VAT});
      case 1:
        return emitChanges({priceDisplay: INCLUDING_VAT});
      default:
        return;
    }
  };

  return (
    <View style={styles.container}>
      <CustomButtonGroup
        value={priceTypeButtonIndex}
        onChange={changePriceToShow}
        buttons={[Translations.PRICE_EXCLUDING_VAT, Translations.PRICE_INCLUDING_VAT]}
        textStyle={styles.buttonGroupText}
      />
      <SelectorInput
        label={Translations.INVOICE_STATE}
        onPress={openSelector}
        value={formData.paymentState}
        data={[
          {label: Translations.ALL, value: InvoiceStates.ALL},
          {label: Translations.PAID, value: InvoiceStates.PAID},
          {label: Translations.OPEN, value: InvoiceStates.OPEN},
        ]}
        onSelect={(value) => emitChanges({paymentState: value})}
        topBorder
      />
      <DateSelectorInput
        label={Translations.FROM}
        value={formData.fromDate}
        onSelect={(value) => emitChanges({fromDate: value})}
      />
      <DateSelectorInput
        label={Translations.TO}
        value={formData.toDate}
        onSelect={(value) => emitChanges({toDate: value})}
      />
      <ListItemDivider title={Translations.SALES} bottomBorder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  buttonGroupText: {
    fontSize: Styles.primaryFontSize,
  },
});
