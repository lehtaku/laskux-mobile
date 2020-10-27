import React, {useCallback, useContext, useEffect, useState} from 'react';

import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {Button, ButtonGroup} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';
import {fetchItemUnits} from '../../services/store/actions/items/fetchItemUnits';
import {fetchCategories} from '../../services/store/actions/items/fetchCategories';
import Translations from '../../services/localization/Translations';

import {getFieldError} from '../../utilities/validations';
import {
  getLocalePriceWithoutVat,
  getLocalePriceWithVat,
  parseDecimal,
} from '../../utilities/calculation';
import {LocalizationContext} from '../../services/localization/LocalizationContext';

import {VAT_VALUES, EXCLUDING_VAT, INCLUDING_VAT} from '../../constants/Params/ItemParams';
import Colors from '../../constants/Colors';

import PlainTextInput from '../Inputs/PlainTextInput';
import NumberInput from '../Inputs/NumberInput';
import SelectorInput from '../Inputs/SelectorInput';
import CustomListItem from '../ListItems/CustomListItem';
import MaterialCommunityIcon from '../Icons/MaterialCommunityIcon';
import HeaderLeftCloseButton from '../Buttons/HeaderButtons/HeaderLeftCloseButton';
import ListItemDivider from '../ListItems/ListItemDivider';
import KeyboardAwareScroll from '../Layout/KeyboardAwareScroll';
import BottomSafeAreaContainer from '../Layout/BottomSafeAreaContainer';
import System from '../../constants/System';
import {VAT_TYPES} from '../../constants/Types/VatTypes';
import TextField from '../ListItems/TextField';
import {parseCurrencyToLocale} from '../../utilities/currencies';
import {parseCommasAndWhitespaces} from '../../utilities/stringHandling';

export default function ItemForm({data, onChange, onSave, error}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const categories = useSelector((store) => store.fetchCategories);
  const units = useSelector((store) => store.fetchItemUnits);

  const {currency, locale} = useContext(LocalizationContext);

  const [activePriceInput, setActivePriceInput] = useState(accountDetails.settings.items.vat_type);
  const [isFormEdited, setIsFormEdited] = useState(false);

  const loadData = useCallback(() => {
    dispatch(fetchItemUnits(account.token));
    dispatch(fetchCategories(account.token));
  }, [account.token, dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const closeForm = useCallback(() => {
    if (!isFormEdited) {
      return navigation.goBack();
    }
    Alert.alert(
      `${Translations.LEAVE_WITHOUT_SAVING_CONFIRM}?`,
      Translations.ALL_PROGRESS_WILL_BE_LOST,
      [
        {
          text: Translations.CANCEL,
          cancelable: true,
          style: 'cancel',
        },
        {
          text: Translations.LEAVE,
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
      {cancelable: true},
    );
  }, [isFormEdited, navigation]);

  const backButtonHandler = useCallback(() => {
    closeForm();
    return true;
  }, [closeForm]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={closeForm} />,
    });
  }, [closeForm, navigation]);

  useFocusEffect(() => {
    if (System.os === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }
  }, [backButtonHandler]);

  const emitChanges = (newData) => {
    setIsFormEdited(true);
    onChange({...data, ...newData});
  };

  const priceHandler = (inputPrice) => {
    let prices = {
      price: data.price,
      price_with_vat: data.price_with_vat,
    };
    switch (activePriceInput) {
      case EXCLUDING_VAT:
        prices = {
          price: inputPrice,
          price_with_vat: getLocalePriceWithVat(
            inputPrice,
            data.vat_percent,
            locale.languageTag,
            currency,
          ),
        };
        break;
      case INCLUDING_VAT:
        prices = {
          price: getLocalePriceWithoutVat(
            inputPrice,
            data.vat_percent,
            locale.languageTag,
            currency,
          ),
          price_with_vat: inputPrice,
        };
        break;
      default:
        break;
    }
    return onChange((formData) => ({
      ...formData,
      price: prices.price,
      price_with_vat: prices.price_with_vat,
    }));
  };

  const vatPercentHandler = (vatPercent) => {
    switch (activePriceInput) {
      case null:
        return emitChanges({
          vat_percent: vatPercent,
        });
      case EXCLUDING_VAT:
        return emitChanges({
          vat_percent: vatPercent,
          price_with_vat: getLocalePriceWithVat(
            data.price,
            vatPercent,
            locale.languageTag,
            currency,
          ),
        });
      case INCLUDING_VAT:
        return emitChanges({
          vat_percent: vatPercent,
          price: getLocalePriceWithoutVat(
            data.price_with_vat,
            vatPercent,
            locale.languageTag,
            currency,
          ),
        });
      default:
        return;
    }
  };

  const openCategorySelector = () => {
    navigation.navigate('SelectorScreen', {
      title: Translations.CATEGORY,
      onSelect: selectCategory,
      iconType: 'plus',
      data: categories.categories.map((category) => {
        return {
          label: category.name,
          value: category.id,
        };
      }),
    });
  };

  const selectCategory = (category) => {
    const isSelected = data.categories.find(
      (categoryToFind) => categoryToFind.id === category.value,
    );
    if (!isSelected) {
      const categoriesClone = [...data.categories];
      categoriesClone.push({
        id: category.value,
        name: category.label,
      });
      emitChanges({categories: categoriesClone});
    }
  };

  const deleteCategory = (categoryId) => {
    emitChanges({
      categories: data.categories.filter((category) => category.id !== categoryId),
    });
  };

  const openSelector = (params) => {
    navigation.navigate('SelectorScreen', params);
  };

  const getVatMethod = () => {
    switch (data.vat_method) {
      case VAT_TYPES.GROSS:
        return 0;
      case VAT_TYPES.NET:
        return 1;
      default:
        return;
    }
  };

  const selectVatMethod = (btnIndex) => {
    switch (btnIndex) {
      case 0:
        setActivePriceInput(EXCLUDING_VAT);
        return emitChanges({vat_method: VAT_TYPES.GROSS});
      case 1:
        setActivePriceInput(INCLUDING_VAT);
        return emitChanges({vat_method: VAT_TYPES.NET});
      default:
        return;
    }
  };

  const getPrice = () => {
    switch (data.vat_method) {
      case VAT_TYPES.GROSS:
        return data.price;
      case VAT_TYPES.NET:
        return data.price_with_vat;
      default:
        return null;
    }
  };

  return (
    <BottomSafeAreaContainer>
      <KeyboardAwareScroll>
        <ListItemDivider title={Translations.ITEM_DETAILS} topBorder />

        <PlainTextInput
          label={Translations.NAME}
          value={data.name}
          onEdit={(value) => emitChanges({name: value})}
          error={getFieldError(error, 'name')}
          maxLength={100}
          topBorder
        />

        <ButtonGroup
          buttons={[Translations.PRICE_EXCLUDING_VAT, Translations.PRICE_INCLUDING_VAT]}
          selectedIndex={getVatMethod()}
          onPress={selectVatMethod}
          containerStyle={styles.vatMethodButtonsContainer}
        />

        <NumberInput
          label={Translations.PRICE}
          value={getPrice()}
          badgeValue={currency}
          error={getFieldError(error, 'price')}
          onEdit={priceHandler}
          topBorder
        />

        <SelectorInput
          label={Translations.VAT}
          value={data.vat_percent}
          onSelect={vatPercentHandler}
          data={VAT_VALUES}
          error={getFieldError(error, 'vat_percent')}
          onPress={openSelector}
        />

        <SelectorInput
          label={Translations.UNIT}
          value={data.unit}
          error={getFieldError(error, 'unit')}
          onSelect={(value) => emitChanges({unit: value})}
          data={units.units.map((item) => {
            return {
              label: `${Translations.ITEM_UNITS[item.value.toUpperCase()].NAME} (${
                Translations.ITEM_UNITS[item.value.toUpperCase()].ABBREVIATION
              })`,
              value: item.value,
            };
          })}
          onPress={openSelector}
        />

        <ListItemDivider title={Translations.PRICE_INFORMATION} bottomBorder />

        <TextField
          title={Translations.PRICE_EXCLUDING_VAT}
          rightTitle={parseCurrencyToLocale(
            locale.languageTag,
            currency,
            parseCommasAndWhitespaces(data.price),
          )}
        />
        <TextField
          title={`${Translations.VAT} (${data.vat_percent} %)`}
          rightTitle={parseCurrencyToLocale(
            locale.languageTag,
            currency,
            parseDecimal(parseCommasAndWhitespaces(data.price_with_vat)) -
              parseDecimal(parseCommasAndWhitespaces(data.price)),
          )}
        />
        <TextField
          title={Translations.PRICE_INCLUDING_VAT_UNIT}
          rightTitle={parseCurrencyToLocale(
            locale.languageTag,
            currency,
            parseCommasAndWhitespaces(data.price_with_vat),
          )}
          bottomDivider
        />

        {categories.categories.length > 0 && (
          <>
            <ListItemDivider title={Translations.ITEM_CATEGORIES} bottomBorder />
            {data.categories.map((category, index) => (
              <CustomListItem
                key={index}
                onPressDelete={() => deleteCategory(category.id)}
                title={category.name}
                style={styles.categoryItem}
                leftIcon={<MaterialCommunityIcon name="tag-multiple" />}
                bottomDivider
              />
            ))}
            <CustomListItem
              title={Translations.ADD_CATEGORY}
              onPress={openCategorySelector}
              style={styles.categoryItem}
              leftIcon={<MaterialCommunityIcon name="tag-plus" />}
              chevron
              bottomDivider
            />
          </>
        )}
      </KeyboardAwareScroll>
      <View style={styles.bottomContainer}>
        <Button
          onPress={onSave}
          title={Translations.SAVE}
          containerStyle={styles.saveButtonContainer}
          buttonStyle={styles.saveButton}
        />
      </View>
    </BottomSafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 16,
  },
  vatMethodButtonsContainer: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderWidth: 0,
    borderRadius: 0,
  },
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
