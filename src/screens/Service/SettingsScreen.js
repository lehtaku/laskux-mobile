import React, {useCallback, useContext, useEffect, useState} from 'react';

import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';
import {fetchServiceSettings} from '../../services/store/actions/service/fetchServiceSettings';
import {fetchItemUnits} from '../../services/store/actions/items/fetchItemUnits';
import {fetchPenaltyInterests} from '../../services/store/actions/invoices/fetchPenaltyInterests';
import {
  updateServiceSettings,
  updateServiceSettingsResetState,
} from '../../services/store/actions/service/updateServiceSettings';
import Translations from '../../services/localization/Translations';
import {getFieldError} from '../../utilities/validations';

import {successAnimation} from '../../constants/Animations';
import {TERMS_OF_PAYMENT, VAT_CODES} from '../../constants/Params/InvoiceParams';
import {VAT_VALUES, EXCLUDING_VAT, INCLUDING_VAT} from '../../constants/Params/ItemParams';
import {CUSTOMER_TYPES} from '../../constants/Params/CustomerParams';
import RequestStates from '../../constants/States/RequestStates';
import Colors from '../../constants/Colors';

import ListItemDivider from '../../components/ListItems/ListItemDivider';
import SelectorInput from '../../components/Inputs/SelectorInput';
import SwitchInput from '../../components/Inputs/SwitchInput';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import BottomSafeAreaContainer from '../../components/Layout/BottomSafeAreaContainer';
import PlainTextInput from '../../components/Inputs/PlainTextInput';

export default function SettingsScreen({navigation}) {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const fetchServiceSettingsState = useSelector((store) => store.fetchServiceSettings);
  const updateServiceSettingsState = useSelector((store) => store.updateServiceSettings);
  const fetchItemUnitsState = useSelector((store) => store.fetchItemUnits);
  const fetchPenaltyInterestsState = useSelector((store) => store.fetchPenaltyInterests);

  const successToast = useSelector((store) => store.showToast.successToast);

  const [formData, setFormData] = useState({
    customer_numbers: null,
    default_customer_type: null,
    default_unit: null,
    default_vat: null,
    incremental_number: null,
    item_dates: null,
    penalty_interest: null,
    show_barcode: null,
    terms_of_payment: null,
    vat_code: null,
    vat0_free_text: null,
    vat_type: null,
  });

  const loadData = useCallback(() => {
    dispatch(fetchServiceSettings(account.token));
    dispatch(fetchItemUnits(account.token));
    dispatch(fetchPenaltyInterests(account.token));
  }, [dispatch, account.token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(updateServiceSettingsResetState());
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (fetchServiceSettingsState.state === RequestStates.SUCCESS) {
      const invoices = fetchServiceSettingsState.invoices;
      const items = fetchServiceSettingsState.items;
      const customers = fetchServiceSettingsState.customers;
      const invoicePdf = fetchServiceSettingsState.invoice_pdf;
      setFormData((data) => ({
        ...data,
        customer_numbers: customers.customer_numbers,
        default_customer_type: customers.default_customer_type,
        default_unit: items.default_unit,
        default_vat: items.default_vat.toString(),
        incremental_number: customers.incremental_number,
        item_dates: invoices.item_dates,
        penalty_interest: invoices.penalty_interest.toString(),
        show_barcode: invoicePdf.show_barcode,
        terms_of_payment: invoices.terms_of_payment.toString(),
        vat_code: invoices.vat_code,
        vat0_free_text: invoices.vat0_free_text,
        vat_type: items.vat_type,
      }));
    }
  }, [
    fetchServiceSettingsState.state,
    fetchServiceSettingsState.invoices,
    fetchServiceSettingsState.items,
    fetchServiceSettingsState.customers,
    fetchServiceSettingsState.invoice_pdf,
  ]);

  useEffect(() => {
    if (updateServiceSettingsState.state === RequestStates.SUCCESS) {
      successToast.show(Translations.SAVE_DETAILS_SUCCESS, successAnimation);
      return navigation.goBack();
    }
  }, [navigation, updateServiceSettingsState.state, successToast]);

  const emitChanges = (newData) => {
    setFormData((data) => ({...data, ...newData}));
  };

  const dispatchUpdateSettings = () => {
    dispatch(updateServiceSettings(account.token, formData));
  };

  const getCustomerTypes = () => {
    const types = [];
    for (const type in CUSTOMER_TYPES) {
      types.push({
        label: Translations[type],
        value: CUSTOMER_TYPES[type],
      });
    }
    return types;
  };

  const getVatCodes = () => {
    let codes = [];
    for (const code in VAT_CODES) {
      codes.push({
        label: Translations.VAT_0_CODES[code],
        value: VAT_CODES[code],
      });
    }
    return codes;
  };

  const openSelector = (params) => {
    navigation.navigate('SelectorScreen', params);
  };

  const isLoading = () => {
    return updateServiceSettingsState.state === RequestStates.LOADING;
  };

  const renderContent = () => {
    switch (fetchServiceSettingsState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_SETTINGS} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_SETTINGS_FAILED}
            onPressButton={loadData}
          />
        );
      case RequestStates.SUCCESS:
        return (
          <BottomSafeAreaContainer>
            {isLoading() && <FloatingLoading />}
            <KeyboardAwareScroll>
              <ListItemDivider title={Translations.SETTINGS_INVOICE} topBorder />
              <SelectorInput
                label={`${Translations.PENALTY_INTEREST} (${Translations.DEFAULT})`}
                value={formData.penalty_interest}
                onSelect={(value) => emitChanges({penalty_interest: value})}
                data={fetchPenaltyInterestsState.penaltyInterests[0].map((item) => {
                  return {
                    label: `${item} %`,
                    value: item.toString(),
                  };
                })}
                onPress={openSelector}
                topBorder
              />

              <SelectorInput
                label={`${Translations.TERMS_OF_PAYMENT} (${Translations.DEFAULT})`}
                value={formData.terms_of_payment}
                onSelect={(value) => emitChanges({terms_of_payment: value})}
                data={TERMS_OF_PAYMENT.map((term) => {
                  return {
                    label: `${term.label} ${Translations.DAYS}`,
                    value: term.value.toString(),
                  };
                })}
                onPress={openSelector}
              />

              <SwitchInput
                label={Translations.INVOICE_LINE_DATES}
                value={formData.item_dates}
                onChange={(value) => emitChanges({item_dates: value})}
                tooltip={Translations.INVOICE_LINE_DATES_TOOLTIP}
              />

              <SelectorInput
                value={formData.vat_code}
                onSelect={(value) => emitChanges({vat_code: value})}
                label={`${Translations.VAT} 0%, ${Translations.CODE} (${Translations.DEFAULT})`}
                tooltip={Translations.VAT_0_DEFAULT_TAX_CODE_TOOLTIP}
                placeholder={Translations.SELECT}
                data={getVatCodes()}
                onPress={openSelector}
              />

              <PlainTextInput
                value={formData.vat0_free_text}
                onEdit={(value) => emitChanges({vat0_free_text: value})}
                maxLength={70}
                tooltip={Translations.VAT_0_DEFAULT_DEFINITION_TOOLTIP}
                label={`${Translations.VAT} 0%, ${Translations.DEFINITION} (${Translations.DEFAULT})`}
                error={getFieldError(updateServiceSettingsState.error, 'vat0_free_text')}
              />

              <SwitchInput
                value={formData.show_barcode}
                onChange={(value) => emitChanges({show_barcode: value})}
                label={Translations.BARCODE}
                tooltip={Translations.BARCODE_TOOLTIP}
              />

              <ListItemDivider title={Translations.SETTINGS_ITEM} />
              <SelectorInput
                label={Translations.PRICES_INPUT}
                value={formData.vat_type}
                tooltip={Translations.PRICES_INPUT_TOOLTIP}
                onSelect={(value) => emitChanges({vat_type: value})}
                data={[
                  {label: Translations.PRICE_EXCLUDING_VAT, value: EXCLUDING_VAT},
                  {label: Translations.PRICE_INCLUDING_VAT, value: INCLUDING_VAT},
                ]}
                onPress={openSelector}
                topBorder
              />
              <SelectorInput
                label={`${Translations.VAT} % (${Translations.DEFAULT})`}
                value={formData.default_vat}
                onSelect={(value) => emitChanges({default_vat: value})}
                data={VAT_VALUES}
                onPress={openSelector}
              />
              <SelectorInput
                label={`${Translations.UNIT} (${Translations.DEFAULT})`}
                value={formData.default_unit}
                onSelect={(value) => emitChanges({default_unit: value})}
                data={fetchItemUnitsState.units.map((item) => {
                  return {
                    label: `${Translations.ITEM_UNITS[item.value.toUpperCase()].NAME} (${
                      Translations.ITEM_UNITS[item.value.toUpperCase()].ABBREVIATION
                    })`,
                    value: item.value,
                  };
                })}
                onPress={openSelector}
              />

              <ListItemDivider title={Translations.SETTINGS_CUSTOMER} />
              <SwitchInput
                label={Translations.USE_CUSTOMER_NUMBER}
                value={formData.customer_numbers}
                onChange={(value) => emitChanges({customer_numbers: value})}
                tooltip={Translations.USE_CUSTOMER_NUMBER_TOOLTIP}
                topBorder
              />
              <SwitchInput
                label={Translations.SEQUENTIAL_CUSTOMER_NUMBER}
                value={formData.incremental_number}
                onChange={(value) => emitChanges({incremental_number: value})}
                tooltip={Translations.SEQUENTIAL_CUSTOMER_NUMBER_TOOLTIP}
              />
              <SelectorInput
                label={`${Translations.CUSTOMER_TYPE} (${Translations.DEFAULT})`}
                value={formData.default_customer_type}
                onSelect={(value) => emitChanges({default_customer_type: value})}
                data={getCustomerTypes()}
                onPress={openSelector}
              />
            </KeyboardAwareScroll>
            <View style={styles.bottomContainer}>
              <Button
                onPress={dispatchUpdateSettings}
                title={Translations.SAVE}
                containerStyle={styles.saveButtonContainer}
                buttonStyle={styles.saveButton}
              />
            </View>
          </BottomSafeAreaContainer>
        );
      default:
        return null;
    }
  };

  return renderContent();
}

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'solid',
  },
  saveButtonContainer: {
    marginVertical: 16,
    marginHorizontal: 12,
  },
  saveButton: {
    paddingVertical: 12,
  },
});
