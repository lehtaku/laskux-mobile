import React, {useCallback, useContext, useEffect, useState} from 'react';

import {BackHandler, StyleSheet, View, Alert} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import _ from 'lodash';

import {Avatar, Button} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';
import {fetchPenaltyInterests} from '../../services/store/actions/invoices/fetchPenaltyInterests';
import {fetchCustomers} from '../../services/store/actions/customers/fetchCustomers';
import {fetchItems} from '../../services/store/actions/items/fetchItems';
import Translations from '../../services/localization/Translations';

import {getFieldError, startsWithNumber} from '../../utilities/validations';
import {getFirstLetter, parseCommasAndWhitespaces} from '../../utilities/stringHandling';
import {parseCurrencyToLocale} from '../../utilities/currencies';
import {
  getPriceWithoutVat,
  getPriceWithVat,
  parseDecimal,
  parseDecimalToString,
} from '../../utilities/calculation';
import {LocalizationContext} from '../../services/localization/LocalizationContext';

import {CUSTOMER_TYPES} from '../../constants/Params/CustomerParams';
import {CUSTOMER_FORM_INITIAL} from '../../constants/States/FormStates';
import System from '../../constants/System';
import RequestStates from '../../constants/States/RequestStates';
import Layout from '../../constants/Layout';
import {FORM_TYPES} from '../../constants/Types/FormTypes';
import {dangerAnimation} from '../../constants/Animations';
import {getCountries} from '../../constants/Countries';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import {EXCLUDING_VAT, INCLUDING_VAT} from '../../constants/Params/ItemParams';
import {VAT_TYPES} from '../../constants/Types/VatTypes';
import {VAT_CODES} from '../../constants/Params/InvoiceParams';

import CustomListItem from '../ListItems/CustomListItem';
import AntDesignIcon from '../Icons/AntDesignIcon';
import CustomerSelector from '../Modals/CustomerSelector';
import SelectedItem from '../ListItems/SelectedItem';
import MaterialCommunityIcon from '../Icons/MaterialCommunityIcon';
import ItemSelector from '../Modals/ItemSelector';
import DateSelectorInput from '../Inputs/DateSelectorInput';
import SelectorInput from '../Inputs/SelectorInput';
import PlainTextInput from '../Inputs/PlainTextInput';
import TextAreaInput from '../Inputs/TextAreaInput';
import StepHeader from '../Layout/StepHeader';
import InvoiceStepButtons from '../Buttons/InvoiceStepButtons';
import HeaderLeftCloseButton from '../Buttons/HeaderButtons/HeaderLeftCloseButton';
import ListItemDivider from '../ListItems/ListItemDivider';
import TextField from '../ListItems/TextField';
import DiscountItem from '../ListItems/DiscountItem';
import MaterialIcon from '../Icons/MaterialIcon';
import KeyboardAwareScroll from '../Layout/KeyboardAwareScroll';
import ClearFix from '../Layout/ClearFix';
import TitleText from '../Text/TitleText';
import PrimaryText from '../Text/PrimaryText';
import BottomSafeAreaContainer from '../Layout/BottomSafeAreaContainer';
import Toast from '../Toasts/Toast';
import CustomDivider from '../Layout/CustomDivider';

export default function OfferForm({formData, onChange, error, onSave, onLeave, formType}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchCustomersState = useSelector((store) => store.fetchCustomers);
  const fetchItemsState = useSelector((store) => store.fetchItems);

  const dangerToast = useSelector((store) => store.showToast.dangerToast);
  const {currency, locale} = useContext(LocalizationContext);

  const [stepIndex, setStepIndex] = useState(0);
  const [isFormEdited, setIsFormEdited] = useState(false);

  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const minTotal = 0;
  const maxTotal = 10000000;

  const [isSelectCustomerVisible, setSelectCustomerVisible] = useState(false);
  const [isSelectItemVisible, setSelectItemVisible] = useState(false);

  const [autoFocusInputs, setAutoFocusInputs] = useState(formType === FORM_TYPES.CREATE);
  const [detailsScroll, setDetailsScroll] = useState(null);
  const [detailsTopClearFix, setDetailsTopClearFix] = useState(null);
  const [detailsBottomClearFix, setDetailsBottomClearFix] = useState(null);

  const closeForm = useCallback(() => {
    if (!isFormEdited) {
      return onLeave();
    }
    Alert.alert(
      `${Translations.LEAVE_WITHOUT_SAVING_CONFIRM}?`,
      Translations.ALL_PROGRESS_WILL_BE_LOST,
      [
        {
          text: Translations.LEAVE,
          style: 'destructive',
          onPress: () => onLeave(),
        },
        {
          text: Translations.SAVE_DRAFT,
          onPress: () => onSave(),
        },
        {
          text: Translations.CANCEL,
          cancelable: true,
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }, [isFormEdited, onSave, onLeave]);

  const backButtonHandler = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      return true;
    } else if (stepIndex === 0) {
      closeForm();
      return true;
    } else {
      return false;
    }
  }, [closeForm, stepIndex]);

  const dispatchFetchCustomers = useCallback(
    (isRefreshing) => {
      dispatch(fetchCustomers('/customers', account.token, isRefreshing));
    },
    [account.token, dispatch],
  );

  const dispatchFetchItems = useCallback(
    (isRefreshing) => {
      dispatch(fetchItems('/items', account.token, isRefreshing));
    },
    [account.token, dispatch],
  );

  useEffect(() => {
    dispatch(fetchPenaltyInterests(account.token));
    dispatchFetchCustomers();
    dispatchFetchItems();
  }, [account.token, dispatch, dispatchFetchCustomers, dispatchFetchItems]);

  useEffect(() => {
    let subTotal = 0;
    let total = 0;
    for (let i = 0; i < formData.items.length; i++) {
      if (startsWithNumber(formData.items[i].quantity)) {
        const quantity = parseFloat(parseCommasAndWhitespaces(formData.items[i].quantity));

        switch (formData.items[i].vat_method) {
          case VAT_TYPES.GROSS:
            subTotal += _.round((parseFloat(formData.items[i].price) * quantity).toFixed(4), 2);
            total += _.round(
              getPriceWithVat(formData.items[i].price, formData.items[i].vat_percent) * quantity,
              2,
            );
            break;
          case VAT_TYPES.NET:
            total += _.round(
              (parseFloat(formData.items[i].price_with_vat) * quantity).toFixed(4),
              2,
            );
            subTotal += _.round(
              getPriceWithoutVat(formData.items[i].price_with_vat, formData.items[i].vat_percent) *
                quantity,
              2,
            );
            break;
          default:
            return;
        }
      }
    }
    for (let i = 0; i < formData.discount_rows.length; i++) {
      if (
        startsWithNumber(formData.discount_rows[i].price) &&
        startsWithNumber(formData.discount_rows[i].price_with_vat)
      ) {
        const price = parseFloat(parseCommasAndWhitespaces(formData.discount_rows[i].price));
        const priceWithVat = parseFloat(
          parseCommasAndWhitespaces(formData.discount_rows[i].price_with_vat),
        );
        subTotal -= price;
        total -= priceWithVat;
      }
    }
    setSubTotalPrice(subTotal);
    setTotalPrice(total);
  }, [currency, formData.discount_rows, formData.items, locale.languageTag]);

  useEffect(() => {
    if (getFieldError(error, 'customer')) {
      setStepIndex(0);
      return dangerToast.show(getFieldError(error, 'customer'), dangerAnimation);
    } else if (getFieldError(error, 'items')) {
      setStepIndex(1);
      return dangerToast.show(getFieldError(error, 'items'), dangerAnimation);
    } else if (getFieldError(error, 'discount_rows')) {
      setStepIndex(1);
      return dangerToast.show(getFieldError(error, 'discount_rows'), dangerAnimation);
    } else if (getFieldError(error, 'vat_groups')) {
      setStepIndex(1);
      return dangerToast.show(getFieldError(error, 'vat_groups'), dangerAnimation);
    } else if (getFieldError(error, 'vat_code')) {
      setStepIndex(1);
    } else if (getFieldError(error, 'vat0_free_text')) {
      setStepIndex(1);
    } else if (getFieldError(error, 'item_vats')) {
      setStepIndex(1);
      return dangerToast.show(getFieldError(error, 'item_vats'), dangerAnimation);
    }
  }, [error, dangerToast]);

  useFocusEffect(() => {
    if (System.os === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }
  }, [backButtonHandler]);

  useEffect(() => {
    if (stepIndex === 2) {
      if (detailsScroll) {
        detailsScroll.scrollToPosition(0, 0, true);
      }
    }
  }, [detailsScroll, detailsTopClearFix, stepIndex]);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerLeft: () => <HeaderLeftCloseButton onPress={closeForm} />,
    });
  }, [closeForm, navigation]);

  const emitChanges = (newData) => {
    setIsFormEdited(true);
    onChange({
      ...formData,
      ...newData,
      ...(!hasZeroVatRows() && {
        vat_code: null,
        vat0_free_text: null,
      }),
    });
  };

  const resetCustomerForm = () => {
    emitChanges({
      customer: CUSTOMER_FORM_INITIAL,
    });
  };

  const openCustomerSelector = () => {
    requestAnimationFrame(() => {
      setSelectCustomerVisible(true);
    });
  };

  const selectCustomer = (customer) => {
    emitChanges({customer});
    setSelectCustomerVisible(false);
  };

  const createCustomer = () => {
    setSelectCustomerVisible(false);
    requestAnimationFrame(() => {
      navigation.navigate('CreateCustomer', {onCustomerCreated: setCustomerData});
    });
  };

  const setCustomerData = (customer) => {
    emitChanges({customer});
  };

  const editCustomer = () => {
    navigation.navigate('EditCustomer', {
      customer: formData.customer,
      onCustomerEdited: setCustomerData,
    });
  };

  const getCustomerType = () => {
    if (formData.customer.type === CUSTOMER_TYPES.INDIVIDUAL) {
      return Translations.INDIVIDUAL;
    } else {
      return Translations.BUSINESS;
    }
  };

  const getCustomerCountry = () => {
    const localizedCountries = getCountries(locale.countryCode);
    for (let [key, value] of Object.entries(localizedCountries)) {
      if (key === formData.customer.country_code) {
        return value;
      }
    }
  };

  const createItem = () => {
    setSelectItemVisible(false);
    requestAnimationFrame(() => {
      navigation.navigate('CreateItem', {onItemCreated: setNewItemData});
    });
  };

  const setNewItemData = (item) => {
    setAutoFocusInputs(true);
    const newItem = {
      date: null,
      id: item.id,
      name: item.name,
      price: item.price,
      price_with_vat: item.price_with_vat,
      unit: item.unit,
      vat_method: item.vat_method,
      vat_percent: item.vat_percent,
      vat_price: parseDecimalToString(parseDecimal(item.price_with_vat) - parseDecimal(item.price)),
      quantity: null,
    };
    emitChanges({items: formData.items.concat(newItem)});
  };

  const editItem = (index) => {
    navigation.navigate('EditItem', {
      item: formData.items[index],
      onItemEdited: setExistingItemData,
    });
  };

  const openItemSelector = () => {
    requestAnimationFrame(() => {
      setSelectItemVisible(true);
    });
  };

  const setExistingItemData = (item) => {
    const itemsClone = [...formData.items];
    const index = itemsClone.findIndex((itemToFind) => itemToFind.id === item.id);
    itemsClone[index] = item;
    emitChanges({items: itemsClone});
  };

  const selectExistingItem = (item) => {
    setAutoFocusInputs(true);
    setSelectItemVisible(false);
    const newItem = {
      ...item,
      date: null,
      vat_price: parseDecimalToString(parseDecimal(item.price_with_vat) - parseDecimal(item.price)),
      quantity: null,
    };
    emitChanges({items: formData.items.concat(newItem)});
  };

  const itemQuantityHandler = (index, quantity) => {
    const itemsClone = [...formData.items];
    itemsClone[index].quantity = quantity;
    emitChanges({items: itemsClone});
  };

  const itemDateHandler = (index, date) => {
    const itemsClone = [...formData.items];
    itemsClone[index].date = date;
    emitChanges({items: itemsClone});
  };

  const deleteItem = (itemIndex) => {
    emitChanges({items: formData.items.filter((item, index) => index !== itemIndex)});
  };

  const getVatMethod = () => {
    switch (accountDetails.settings.items.vat_type) {
      case EXCLUDING_VAT:
        return VAT_TYPES.GROSS;
      case INCLUDING_VAT:
        return VAT_TYPES.NET;
      default:
        return;
    }
  };

  const addDiscountRow = () => {
    setAutoFocusInputs(true);
    const newItem = {
      name: Translations.DISCOUNT,
      price: null,
      price_with_vat: null,
      quantity: 1,
      total_price: null,
      vat_method: getVatMethod(),
      vat_percent: accountDetails.settings.items.default_vat.toString(),
      vat_price: null,
    };
    emitChanges({discount_rows: formData.discount_rows.concat(newItem)});
  };

  const editDiscountRow = (itemIndex, item) => {
    const editedItem = {
      ...item,
      vat_price: parseDecimalToString(
        parseCommasAndWhitespaces(item.price_with_vat) - parseCommasAndWhitespaces(item.price),
      ),
    };
    const discountRowsClone = [...formData.discount_rows];
    discountRowsClone[itemIndex] = editedItem;
    emitChanges({discount_rows: discountRowsClone});
  };

  const deleteDiscountRow = (itemIndex) => {
    emitChanges({
      discount_rows: formData.discount_rows.filter((item, index) => index !== itemIndex),
    });
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

  const hasZeroVatRows = () => {
    return formData.items.some((item) => item.vat_percent.toString() === '0');
  };

  const getTotalPriceError = () => {
    if (totalPrice > maxTotal) {
      const total = parseCurrencyToLocale(locale.languageTag, currency, maxTotal);
      return `${Translations.TOTAL_MAY_NOT_EXCEED} ${total}`;
    } else if (totalPrice < minTotal) {
      return Translations.TOTAL_MAY_NOT_BE_NEGATIVE;
    }
  };

  const isTotalPriceValid = () => {
    return totalPrice <= maxTotal && totalPrice >= minTotal;
  };

  const moveToPreviousStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const moveToNextStep = () => {
    if (stepIndex < 3) {
      setStepIndex(stepIndex + 1);
    }
  };

  const openSelector = (params) => {
    navigation.navigate('SelectorScreen', params);
  };

  const scrollToBottom = () => {
    if (System.os === 'ios') {
      detailsBottomClearFix.measure((width, height) => {
        if (detailsScroll) {
          detailsScroll.scrollToPosition(0, height - Layout.window.height / 2.25, true);
        }
      });
    }
  };

  const CustomerView = () => (
    <View style={styles.container}>
      <StepHeader subtitle="1/3" title={Translations.CUSTOMER} progress={0.33} />
      <KeyboardAwareScroll>
        {!formData.customer.id ? (
          <>
            <CustomListItem
              title={Translations.EXISTING_CUSTOMER}
              onPress={openCustomerSelector}
              leftIcon={<AntDesignIcon name="user" />}
              style={styles.customerSelectorItem}
              topDivider
              bottomDivider
              chevron
            />

            <CustomerSelector
              isVisible={isSelectCustomerVisible}
              isLoading={fetchCustomersState.state === RequestStates.LOADING}
              isRefreshing={fetchCustomersState.state === RequestStates.REFRESHING}
              customers={fetchCustomersState.customers}
              onSelect={selectCustomer}
              onCancel={() => setSelectCustomerVisible(false)}
              onRefresh={() => dispatchFetchCustomers(true)}
              onCreate={createCustomer}
            />

            <CustomListItem
              title={Translations.NEW_CUSTOMER}
              onPress={createCustomer}
              leftIcon={<AntDesignIcon name="adduser" />}
              style={styles.customerSelectorItem}
              bottomDivider
              chevron
            />
          </>
        ) : (
          <View style={styles.customerContainer}>
            <View style={styles.customerHeaderContainer}>
              <View>
                <Avatar
                  size={48}
                  containerStyle={styles.customerAvatarContainer}
                  title={getFirstLetter(formData.customer.name)}
                  rounded
                />
              </View>
              <View style={styles.customerHeaderCenter}>
                <TitleText text={formData.customer.name} style={styles.customerName} />
                <PrimaryText text={getCustomerType()} />
              </View>
              <View style={styles.customerHeaderRight}>
                <Button
                  icon={<MaterialIcon size={24} name="edit" />}
                  onPress={editCustomer}
                  buttonStyle={styles.customerOptionsButton}
                />
                <Button
                  icon={<AntDesignIcon size={24} name="close" />}
                  onPress={resetCustomerForm}
                  buttonStyle={styles.customerOptionsButton}
                />
              </View>
            </View>

            {formData.customer.available_invoicing_formats.length === 0 && (
              <>
                <CustomDivider />
                <Toast message={Translations.CUSTOMER_DONT_HAVE_AVAILABLE_FORMATS} type="warning" />
              </>
            )}

            <ListItemDivider title={Translations.CUSTOMER_DETAILS} borders />
            <TextField
              title={Translations.CUSTOMER_NUMBER}
              rightTitle={formData.customer.customer_number}
            />
            <TextField title={Translations.EMAIL} rightTitle={formData.customer.email} />

            {formData.customer.type === CUSTOMER_TYPES.BUSINESS && (
              <>
                <TextField
                  title={Translations.BUSINESS_ID}
                  rightTitle={formData.customer.business_id}
                />
                <TextField title={Translations.VAT_ID} rightTitle={formData.customer.vat_id} />

                <ListItemDivider title={Translations.E_INVOICING} borders />
                <TextField
                  title={Translations.E_INVOICING_OPERATOR}
                  rightTitle={
                    formData.customer.e_invoicing_operator &&
                    formData.customer.e_invoicing_operator.name
                  }
                />
                <TextField
                  title={Translations.ADDRESS}
                  rightTitle={formData.customer.e_invoicing_address}
                />
              </>
            )}
            <ListItemDivider title={Translations.ADDRESS_DETAILS} borders />
            <TextField title={Translations.STREET} rightTitle={formData.customer.address} />
            <TextField title={Translations.ZIP_CODE} rightTitle={formData.customer.zip_code} />
            <TextField title={Translations.CITY} rightTitle={formData.customer.city} />
            <TextField
              title={Translations.COUNTRY}
              rightTitle={getCustomerCountry()}
              bottomDivider
            />
          </View>
        )}
      </KeyboardAwareScroll>
    </View>
  );

  const ItemsView = () => (
    <View style={styles.container}>
      <StepHeader subtitle="2/3" title={Translations.OFFER_LINES} progress={0.66} />
      <KeyboardAwareScroll extraScrollHeight={96}>
        {formData.items.map((item, index) => (
          <SelectedItem
            key={index}
            item={item}
            onDelete={() => deleteItem(index)}
            onEdit={() => editItem(index)}
            onQuantityChange={(value) => itemQuantityHandler(index, value)}
            onSelectDate={(value) => itemDateHandler(index, value)}
            autoFocus={autoFocusInputs}
          />
        ))}
        {formData.discount_rows.map((item, index) => (
          <DiscountItem
            key={index}
            item={item}
            onChange={(value) => editDiscountRow(index, value)}
            onDelete={() => deleteDiscountRow(index)}
            autoFocus={autoFocusInputs}
            onPressSelectVat={openSelector}
          />
        ))}
        <ListItemDivider title={Translations.ADD_LINE} borders />
        <CustomListItem
          title={Translations.EXISTING_ITEM}
          onPress={openItemSelector}
          leftIcon={<MaterialCommunityIcon name="tag" />}
          style={styles.addLineItem}
          chevron
          bottomDivider
        />
        <CustomListItem
          title={Translations.NEW_ITEM}
          onPress={createItem}
          leftIcon={<MaterialCommunityIcon name="tag-plus" />}
          style={styles.addLineItem}
          bottomDivider
          chevron
        />
        <ItemSelector
          isVisible={isSelectItemVisible}
          items={fetchItemsState.items}
          onCreate={createItem}
          isLoading={fetchItemsState.state === RequestStates.LOADING}
          isRefreshing={fetchItemsState.state === RequestStates.REFRESHING}
          onSelect={selectExistingItem}
          onCancel={() => setSelectItemVisible(false)}
          onRefresh={() => dispatchFetchItems(true)}
        />
        <CustomListItem
          title={Translations.DISCOUNT}
          onPress={addDiscountRow}
          leftIcon={<MaterialIcon name="money-off" />}
          style={styles.addLineItem}
          chevron
          bottomDivider
        />

        {hasZeroVatRows() && (
          <View>
            <ListItemDivider title={Translations.MORE_INFORMATION} />
            <SelectorInput
              value={formData.vat_code}
              onSelect={(value) => emitChanges({vat_code: value})}
              label={`${Translations.VAT} 0%, ${Translations.CODE}`}
              tooltip={Translations.VAT_0_TAX_CODE_TOOLTIP}
              placeholder={Translations.SELECT}
              data={getVatCodes()}
              onPress={openSelector}
              error={getFieldError(error, 'vat_code')}
              topBorder
            />

            <PlainTextInput
              value={formData.vat0_free_text}
              onEdit={(value) => emitChanges({vat0_free_text: value})}
              maxLength={70}
              tooltip={Translations.VAT_0_DEFINITION_TOOLTIP}
              label={`${Translations.VAT} 0%, ${Translations.DEFINITION}`}
              error={getFieldError(error, 'vat0_free_text')}
            />
          </View>
        )}

        <ListItemDivider title={Translations.IN_TOTAL} bottomBorder />
        <View style={styles.totalContainer}>
          <TextField
            title={Translations.SUBTOTAL}
            titleStyle={styles.priceDescriptionText}
            rightTitleStyle={styles.priceText}
            rightTitle={parseCurrencyToLocale(
              locale.languageTag,
              currency,
              _.round(subTotalPrice.toFixed(4), 2),
            )}
          />
          <TextField
            title={Translations.TOTAL}
            titleStyle={styles.priceDescriptionText}
            rightTitle={parseCurrencyToLocale(locale.languageTag, currency, totalPrice)}
            rightTitleStyle={styles.priceText}
            dangerText={getTotalPriceError()}
          />
        </View>
      </KeyboardAwareScroll>
    </View>
  );

  const DetailsView = () => (
    <View style={styles.container}>
      <StepHeader subtitle="3/3" title={Translations.OFFER_DETAILS} progress={1} />
      <View ref={setDetailsTopClearFix} />
      <KeyboardAwareScroll innerRef={setDetailsScroll}>
        <DateSelectorInput
          label={Translations.OFFER_DATE}
          value={formData.offer_date}
          onSelect={(value) => emitChanges({offer_date: value})}
          error={getFieldError(error, 'offer_date')}
          topBorder
        />

        <DateSelectorInput
          label={Translations.VALID_TO}
          value={formData.valid_to}
          onSelect={(value) => emitChanges({valid_to: value})}
          error={getFieldError(error, 'valid_to')}
        />

        <TextAreaInput
          label={Translations.MORE_INFORMATION}
          value={formData.details}
          onEdit={(value) => emitChanges({details: value})}
          onSubmitEditing={scrollToBottom}
          error={getFieldError(error, 'details')}
          maxLength={250}
        />

        <TextAreaInput
          label={Translations.MESSAGE}
          value={formData.message}
          onEdit={(value) => emitChanges({message: value})}
          onSubmitEditing={scrollToBottom}
          error={getFieldError(error, 'message')}
          maxLength={250}
        />

        <ClearFix innerRef={setDetailsBottomClearFix} />
      </KeyboardAwareScroll>
    </View>
  );

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return CustomerView();
      case 1:
        return ItemsView();
      case 2:
        return DetailsView();
      default:
        return null;
    }
  };

  const renderStepButtons = () => {
    let back;
    let next;
    let save;
    let isNextDisabled;
    switch (stepIndex) {
      case 0:
        next = moveToNextStep;
        isNextDisabled = !formData.customer.id;
        break;
      case 1:
        back = () => {
          setAutoFocusInputs(false);
          moveToPreviousStep();
        };
        next = () => {
          setAutoFocusInputs(false);
          moveToNextStep();
        };
        isNextDisabled = formData.items.length < 1 || !isTotalPriceValid();
        break;
      case 2:
        back = moveToPreviousStep;
        save = onSave;
        break;
      default:
        break;
    }
    return (
      <InvoiceStepButtons
        onBack={back}
        onNext={next}
        onSave={save}
        isNextDisabled={isNextDisabled}
      />
    );
  };

  return (
    <BottomSafeAreaContainer>
      {renderStep()}
      {renderStepButtons()}
    </BottomSafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  customerSelectorItem: {
    paddingVertical: 20,
  },
  customerContainer: {
    backgroundColor: Colors.white,
  },
  customerHeaderContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'solid',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  customerHeaderCenter: {
    flex: 1,
    paddingHorizontal: 16,
  },
  customerHeaderRight: {
    flexDirection: 'row',
  },
  customerAvatarContainer: {
    backgroundColor: Colors.tintColor,
  },
  customerName: {
    marginBottom: 4,
  },
  customerOptionsButton: {
    backgroundColor: 'transparent',
    padding: 0,
    marginLeft: 12,
  },
  addLineItem: {
    paddingVertical: 12,
  },
  totalContainer: {
    backgroundColor: Colors.white,
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderStyle: 'solid',
  },
  priceDescriptionText: {
    fontFamily: Styles.fontSemiBold,
  },
  priceText: {
    color: Colors.black,
  },
  previewContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
});
