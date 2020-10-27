import React, {useCallback, useContext, useEffect, useState} from 'react';

import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {Button} from 'react-native-elements';
import {useActionSheet} from '@expo/react-native-action-sheet';

import {useDispatch, useSelector} from 'react-redux';
import {fetchGroups} from '../../services/store/actions/customers/fetchGroups';
import {addNote, addNoteResetState} from '../../services/store/actions/customers/addNote';
import {deleteNote, deleteNoteResetState} from '../../services/store/actions/customers/deleteNote';
import {fetchOperators} from '../../services/store/actions/tools/fetchOperators';
import {searchCompanyById} from '../../services/store/actions/tools/searchCompanyById';
import {searchCompanyByName} from '../../services/store/actions/tools/searchCompanyByName';
import Translations from '../../services/localization/Translations';

import {getFieldError} from '../../utilities/validations';
import {formatToLocaleDateTime} from '../../utilities/date';
import {isBusinessId} from '../../utilities/validations';
import {LocalizationContext} from '../../services/localization/LocalizationContext';

import {getCountries} from '../../constants/Countries';
import {CUSTOMER_TYPES} from '../../constants/Params/CustomerParams';
import {FORM_TYPES} from '../../constants/Types/FormTypes';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import RequestStates from '../../constants/States/RequestStates';
import {dangerAnimation} from '../../constants/Animations';
import System from '../../constants/System';
import Layout from '../../constants/Layout';
import {INVOICE_FORMATS} from '../../constants/Params/InvoiceParams';
import {CUSTOMER_FORM_INITIAL} from '../../constants/States/FormStates';

import NumberInput from '../Inputs/NumberInput';
import PlainTextInput from '../Inputs/PlainTextInput';
import EmailInput from '../Inputs/EmailInput';
import SelectorInput from '../Inputs/SelectorInput';
import CustomListItem from '../ListItems/CustomListItem';
import MaterialIcon from '../Icons/MaterialIcon';
import HeaderLeftCloseButton from '../Buttons/HeaderButtons/HeaderLeftCloseButton';
import ListItemDivider from '../ListItems/ListItemDivider';
import TextAreaInput from '../Inputs/TextAreaInput';
import ClearFix from '../Layout/ClearFix';
import TextField from '../ListItems/TextField';
import AntDesignIcon from '../Icons/AntDesignIcon';
import KeyboardAwareScroll from '../Layout/KeyboardAwareScroll';
import FloatingLoading from '../Indicators/FloatingLoading';
import BottomSafeAreaContainer from '../Layout/BottomSafeAreaContainer';
import CustomSearchBar from '../Layout/CustomSearchBar';
import CustomButtonGroup from '../Buttons/CustomButtonGroup';

export default function CustomerForm({data, onChange, onSave, onRefresh, error, formType}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchGroupsState = useSelector((store) => store.fetchGroups);
  const addNoteState = useSelector((store) => store.addCustomerNote);
  const deleteNoteState = useSelector((store) => store.deleteCustomerNote);
  const fetchOperatorsState = useSelector((store) => store.fetchOperators);
  const searchCompanyByIdState = useSelector((store) => store.searchCompanyById);
  const searchCompanyByNameState = useSelector((store) => store.searchCompanyByName);

  const {showActionSheetWithOptions} = useActionSheet();
  const {locale} = useContext(LocalizationContext);
  const dangerToast = useSelector((store) => store.showToast.dangerToast);

  const [searchKeyword, setSearchKeyword] = useState(null);

  const [isFormEdited, setIsFormEdited] = useState(false);
  const [isAllFieldsVisible, setIsAllFieldsVisible] = useState(formType !== FORM_TYPES.CREATE);
  const [isNewNoteInputVisible, setIsNewNoteInputVisible] = useState(false);
  const [noteData, setNoteData] = useState(null);

  const [scroll, setScroll] = useState(null);
  const [bottomClearFix, setBottomClearFix] = useState(null);

  const loadData = useCallback(() => {
    dispatch(fetchGroups(account.token));
    dispatch(fetchOperators(account.token));
  }, [account.token, dispatch]);

  const closeForm = useCallback(() => {
    if (!isFormEdited) {
      return navigation.goBack();
    }
    return Alert.alert(
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

  const openCompanySelector = useCallback(() => {
    navigation.navigate('SelectorScreen', {
      title: Translations.BUSINESS_SEARCH,
      onSelect: (company) => dispatch(searchCompanyById(company.value, account.token)),
      iconType: 'chevron',
      data: searchCompanyByNameState.list.map((item) => {
        return {
          label: item.name,
          value: item.business_id,
        };
      }),
    });
  }, [navigation, searchCompanyByNameState.list, account.token, dispatch]);

  const openEInvoicingSelector = useCallback(() => {
    navigation.navigate('SelectorScreen', {
      title: Translations.E_INVOICING_ADDRESS,
      onSelect: (item) => {
        const address = searchCompanyByIdState.details.e_invoicing_addresses.find(
          (addressToFind) => addressToFind.e_invoicing_address === item.value,
        );
        const operator = fetchOperatorsState.operators.find(
          (operatorToFind) => operatorToFind.id === address.e_invoicing_operator_id,
        );
        onChange({
          ...data,
          e_invoicing_operator: operator,
          e_invoicing_address: address.e_invoicing_address,
        });
      },
      iconType: 'chevron',
      data: searchCompanyByIdState.details.e_invoicing_addresses.map((item) => {
        const {name, e_invoicing_operator_name, e_invoicing_address} = item;
        return {
          label: name,
          value: e_invoicing_address,
          description: `${e_invoicing_operator_name} | ${e_invoicing_address}`,
        };
      }),
    });
  }, [
    data,
    fetchOperatorsState.operators,
    navigation,
    onChange,
    searchCompanyByIdState.details.e_invoicing_addresses,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (addNoteState.state === RequestStates.SUCCESS) {
      dispatch(addNoteResetState());
      setIsNewNoteInputVisible(false);
      setNoteData(null);
      onRefresh();
    } else if (addNoteState.state === RequestStates.ERROR) {
      return dangerToast.show(Translations.ADD_NOTE_FAILED, dangerAnimation);
    }
  }, [onRefresh, loadData, addNoteState.state, dispatch, dangerToast]);

  useEffect(() => {
    if (deleteNoteState.state === RequestStates.SUCCESS) {
      dispatch(deleteNoteResetState());
      onRefresh();
    } else if (deleteNoteState.state === RequestStates.ERROR) {
      dangerToast.show(Translations.ADD_NOTE_FAILED, dangerAnimation);
    }
  }, [dispatch, onRefresh, deleteNoteState.state, dangerToast]);

  useEffect(() => {
    if (searchCompanyByIdState.state === RequestStates.SUCCESS) {
      setIsAllFieldsVisible(true);
      if (searchCompanyByIdState.details.e_invoicing_addresses.length > 1) {
        openEInvoicingSelector();
      }
    }
  }, [
    openEInvoicingSelector,
    searchCompanyByIdState.details.e_invoicing_addresses.length,
    searchCompanyByIdState.state,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeftCloseButton onPress={closeForm} />,
    });
  }, [closeForm, navigation]);

  useEffect(() => {
    if (searchCompanyByNameState.state === RequestStates.SUCCESS) {
      if (searchCompanyByNameState.list.length > 0) {
        openCompanySelector();
      }
    }
  }, [searchCompanyByNameState.state, searchCompanyByNameState.list.length, openCompanySelector]);

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

  const getCustomerTypeButtonIndex = () => {
    switch (data.type) {
      case CUSTOMER_TYPES.BUSINESS:
        return 0;
      case CUSTOMER_TYPES.INDIVIDUAL:
        return 1;
      default:
        return 0;
    }
  };

  const changeCustomerType = (buttonIndex) => {
    switch (buttonIndex) {
      case 0:
        return emitChanges({type: CUSTOMER_TYPES.BUSINESS});
      case 1:
        return emitChanges({
          business_id: null,
          e_invoicing_operator: CUSTOMER_FORM_INITIAL.e_invoicing_operator,
          e_invoicing_address: null,
          type: CUSTOMER_TYPES.INDIVIDUAL,
          vat_id: null,
        });
      default:
        return;
    }
  };

  const doBusinessSearch = () => {
    if (isBusinessId(searchKeyword)) {
      dispatch(searchCompanyById(searchKeyword, account.token));
    } else {
      dispatch(searchCompanyByName(searchKeyword, account.token));
    }
  };

  const selectOperator = (operatorId) => {
    const operator = fetchOperatorsState.operators.find(
      (operatorToFind) => operatorToFind.id === operatorId,
    );
    if (!operator) {
      onChange({...data, e_invoicing_operator: null});
    }
    onChange({...data, e_invoicing_operator: operator});
  };

  const openGroupSelector = () => {
    navigation.navigate('SelectorScreen', {
      title: Translations.CUSTOMER_GROUP,
      onSelect: selectGroup,
      iconType: 'plus',
      data: fetchGroupsState.groups.map((group) => {
        return {
          label: group.name,
          value: group.id,
        };
      }),
    });
  };

  const selectGroup = (group) => {
    const isSelected = data.groups.find((groupToFind) => groupToFind.id === group.value);
    if (!isSelected) {
      const groupsClone = [...data.groups];
      groupsClone.push({
        id: group.value,
        name: group.label,
      });
      emitChanges({groups: groupsClone});
    }
  };

  const deleteGroup = (groupId) => {
    emitChanges({groups: data.groups.filter((group) => group.id !== groupId)});
  };

  const dispatchAddNote = () => {
    const inputData = {
      note: noteData,
    };
    dispatch(addNote(data.id, account.token, inputData));
  };

  const showOptions = (note) => {
    const title = Translations.NOTE;
    const options = [Translations.DELETE, Translations.CANCEL];
    const destructiveButtonIndex = options.indexOf(Translations.DELETE);
    const cancelButtonIndex = options.indexOf(Translations.CANCEL);

    const icons = [<AntDesignIcon name="delete" />, <MaterialIcon name="cancel" />];

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        tintColor: Colors.tintColor,
        icons,
      },
      (buttonIndex) => {
        if (buttonIndex === options.indexOf(Translations.DELETE)) {
          dispatch(deleteNote(data.id, note.id, account.token));
        }
      },
    );
  };

  const getCountrySelectorData = () => {
    const localizedCountries = getCountries(locale.countryCode);
    const countries = [];
    for (let [key, value] of Object.entries(localizedCountries)) {
      countries.push({
        label: value,
        value: key,
      });
    }
    return countries;
  };

  const getNameFieldLabel = () => {
    switch (data.type) {
      case CUSTOMER_TYPES.BUSINESS:
        return Translations.BUSINESS_NAME;
      case CUSTOMER_TYPES.INDIVIDUAL:
        return Translations.NAME;
      default:
        return Translations.BUSINESS_NAME;
    }
  };

  const scrollToBottom = () => {
    if (System.os === 'ios') {
      bottomClearFix.measure((width, height) => {
        if (scroll) {
          scroll.scrollToPosition(0, height - Layout.window.height / 1.8, true);
        }
      });
    }
  };

  const isInvoicingFormatDisabled = (format) => {
    switch (format) {
      case INVOICE_FORMATS.EMAIL:
        return data.email === null;
      case INVOICE_FORMATS.E_INVOICE:
        return data.e_invoicing_operator === null || data.e_invoicing_address === null;
      case INVOICE_FORMATS.PAPER:
        return (
          data.address === null ||
          data.zip_code === null ||
          data.city === null ||
          data.country_code === null
        );
      default:
        return;
    }
  };

  const getInvoicingFormats = () => {
    const formats = [];
    for (const format in INVOICE_FORMATS) {
      formats.push({
        label: Translations[format],
        value: INVOICE_FORMATS[format],
        disabled: isInvoicingFormatDisabled(INVOICE_FORMATS[format]),
      });
    }
    return formats;
  };

  const getCountryCode = () => {
    if (data.country_code) {
      return data.country_code;
    } else {
      return locale.languageCode.toUpperCase();
    }
  };

  const openSelector = (params) => {
    navigation.navigate('SelectorScreen', params);
  };

  const renderNoteButtons = () => {
    if (isNewNoteInputVisible) {
      return (
        <View style={styles.noteButtonsContainer}>
          <Button
            onPress={() => setIsNewNoteInputVisible(false)}
            title={Translations.CANCEL}
            titleStyle={styles.addNoteButtonTitle}
            buttonStyle={styles.addNoteButton}
          />
          <Button
            onPress={dispatchAddNote}
            title={Translations.OK}
            titleStyle={styles.addNoteButtonTitle}
            buttonStyle={{...styles.addNoteButton, ...styles.addNoteOkButton}}
          />
        </View>
      );
    } else {
      return (
        <Button
          onPress={() => setIsNewNoteInputVisible(true)}
          title={Translations.ADD}
          titleStyle={styles.addNoteButtonTitle}
          buttonStyle={styles.addNoteButton}
        />
      );
    }
  };

  const checkSearchError = () => {
    const isSuccess = searchCompanyByNameState.state === RequestStates.SUCCESS;
    const nameError = getFieldError(searchCompanyByNameState.error, 'name');
    const businessIdError = getFieldError(searchCompanyByIdState.error, 'business_id');
    if (nameError) {
      return nameError;
    } else if (businessIdError) {
      return businessIdError;
    } else if (isSuccess && searchCompanyByNameState.list.length === 0) {
      if (searchCompanyByNameState.count > 0) {
        return Translations.SEARCHING_COMPANIES_TOO_MANY_RESULTS;
      } else {
        return Translations.NO_SEARCH_RESULTS;
      }
    }
  };

  const isLoading = () => {
    return (
      addNoteState.state === RequestStates.LOADING ||
      deleteNoteState.state === RequestStates.LOADING
    );
  };

  return (
    <BottomSafeAreaContainer>
      {isLoading() && <FloatingLoading />}
      {searchCompanyByNameState.state === RequestStates.LOADING && (
        <FloatingLoading text={`${Translations.SEARCHING_COMPANIES}..`} />
      )}
      {searchCompanyByIdState.state === RequestStates.LOADING && (
        <FloatingLoading text={`${Translations.SEARCHING_COMPANY}..`} />
      )}
      <KeyboardAwareScroll innerRef={setScroll}>
        <CustomButtonGroup
          buttons={[Translations.BUSINESS, Translations.INDIVIDUAL]}
          onChange={changeCustomerType}
          value={getCustomerTypeButtonIndex()}
        />

        {data.type === CUSTOMER_TYPES.BUSINESS && formType === FORM_TYPES.CREATE && (
          <>
            <ListItemDivider title={Translations.BUSINESS_SEARCH} borders />
            <CustomSearchBar
              value={searchKeyword}
              onSearch={setSearchKeyword}
              placeholder={`${Translations.BUSINESS_NAME} ${Translations.OR} ${Translations.BUSINESS_ID}`}
              onSubmit={doBusinessSearch}
              error={checkSearchError()}
            />
          </>
        )}

        <ListItemDivider title={Translations.CUSTOMER_DETAILS} topBorder />
        {accountDetails.settings.customers.customer_numbers && (
          <NumberInput
            label={Translations.CUSTOMER_NUMBER}
            value={data.customer_number}
            onEdit={(value) => emitChanges({customer_number: value})}
            error={getFieldError(error, 'customer_number')}
            keyboardType="number-pad"
            maxLength={50}
            topBorder
          />
        )}

        <PlainTextInput
          label={getNameFieldLabel()}
          value={data.name}
          onEdit={(value) => emitChanges({name: value})}
          error={getFieldError(error, 'name')}
          maxLength={250}
        />

        {data.type === CUSTOMER_TYPES.BUSINESS && (
          <PlainTextInput
            label={`${Translations.BUSINESS_ID} *`}
            value={data.business_id}
            onEdit={(value) => emitChanges({business_id: value})}
            error={getFieldError(error, 'business_id')}
          />
        )}

        <EmailInput
          label={Translations.EMAIL}
          value={data.email}
          onEdit={(value) => emitChanges({email: value})}
          error={getFieldError(error, 'email')}
          maxLength={250}
        />

        {!isAllFieldsVisible && (
          <Button
            title={Translations.SHOW_ALL_FIELDS}
            onPress={() => setIsAllFieldsVisible(true)}
            buttonStyle={styles.showAllButton}
            titleStyle={styles.showAllButtonTitle}
          />
        )}

        {isAllFieldsVisible && (
          <>
            <NumberInput
              label={Translations.PHONE}
              value={data.phone}
              onEdit={(value) => emitChanges({phone: value})}
              error={getFieldError(error, 'phone')}
              maxLength={250}
            />

            {data.type === CUSTOMER_TYPES.BUSINESS && (
              <>
                <PlainTextInput
                  label={Translations.VAT_ID}
                  value={data.vat_id}
                  onEdit={(value) => emitChanges({vat_id: value})}
                  error={getFieldError(error, 'vat_id')}
                />

                <ListItemDivider title={Translations.E_INVOICING} />
                <SelectorInput
                  label={Translations.E_INVOICING_OPERATOR}
                  onSelect={selectOperator}
                  placeholder={Translations.SELECT}
                  value={data.e_invoicing_operator && data.e_invoicing_operator.id}
                  error={getFieldError(error, 'e_invoicing_operator_id')}
                  data={fetchOperatorsState.operators.map((operator) => {
                    return {
                      label: operator.name,
                      value: operator.id,
                    };
                  })}
                  onPress={openSelector}
                  topBorder
                />
                <PlainTextInput
                  value={data.e_invoicing_address}
                  onEdit={(value) => emitChanges({e_invoicing_address: value})}
                  error={getFieldError(error, 'e_invoicing_address')}
                  label={Translations.ADDRESS}
                  maxLength={36}
                />
              </>
            )}

            <ListItemDivider title={Translations.ADDRESS_DETAILS} />
            <PlainTextInput
              label={Translations.STREET}
              value={data.address}
              onEdit={(value) => emitChanges({address: value})}
              error={getFieldError(error, 'address')}
              maxLength={250}
              topBorder
            />

            <PlainTextInput
              label={`${Translations.STREET} 2`}
              value={data.address2}
              onEdit={(value) => emitChanges({address2: value})}
              error={getFieldError(error, 'address2')}
              maxLength={250}
            />

            <NumberInput
              label={Translations.ZIP_CODE}
              value={data.zip_code}
              onEdit={(value) => emitChanges({zip_code: value})}
              error={getFieldError(error, 'zip_code')}
              maxLength={10}
            />

            <PlainTextInput
              label={Translations.CITY}
              value={data.city}
              onEdit={(value) => emitChanges({city: value})}
              error={getFieldError(error, 'city')}
              maxLength={100}
            />

            <SelectorInput
              label={Translations.COUNTRY}
              data={getCountrySelectorData()}
              value={getCountryCode()}
              onSelect={(value) => emitChanges({country_code: value})}
              error={getFieldError(error, 'country_code')}
              onPress={openSelector}
            />

            <ListItemDivider title={Translations.SETTINGS} />
            <SelectorInput
              placeholder={Translations.SELECT}
              label={Translations.PRIMARY_INVOICING_METHOD}
              tooltip={Translations.PRIMARY_INVOICING_METHOD_TOOLTIP}
              value={data.primary_invoicing_format}
              data={getInvoicingFormats()}
              onSelect={(value) => emitChanges({primary_invoicing_format: value})}
              error={getFieldError(error, 'primary_invoicing_format')}
              onPress={openSelector}
              topBorder
            />

            {fetchGroupsState.groups.length > 0 && (
              <>
                <ListItemDivider title={Translations.CUSTOMER_GROUPS} bottomBorder />
                {data.groups.map((group, index) => (
                  <CustomListItem
                    key={index}
                    onPressDelete={() => deleteGroup(group.id)}
                    title={group.name}
                    style={styles.groupItem}
                    leftIcon={<MaterialIcon name="group" />}
                    bottomDivider
                  />
                ))}
                <CustomListItem
                  title={Translations.ADD_GROUP}
                  onPress={openGroupSelector}
                  style={styles.groupItem}
                  leftIcon={<MaterialIcon name="group-add" />}
                  chevron
                  bottomDivider
                />
              </>
            )}

            {formType === FORM_TYPES.EDIT && (
              <>
                <ListItemDivider
                  title={Translations.NOTES}
                  rightTitle={renderNoteButtons()}
                  bottomBorder
                />
                {isNewNoteInputVisible && (
                  <TextAreaInput
                    label={Translations.NOTE}
                    value={noteData}
                    onEdit={setNoteData}
                    autoFocus
                    onSubmitEditing={scrollToBottom}
                  />
                )}
                <ClearFix innerRef={setBottomClearFix} />
                {data.notes.length < 1 && !isNewNoteInputVisible && (
                  <CustomListItem title={Translations.NO_NOTES} bottomDivider />
                )}
                {data.notes.map((item, key) => (
                  <TextField
                    key={key}
                    title={formatToLocaleDateTime(item.created_at, locale.languageCode)}
                    onPress={() => showOptions(item)}
                    rightTitle={item.note}
                    bottomDivider
                  />
                ))}
              </>
            )}
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
  groupItem: {
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 16,
  },
  showAllButton: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 12,
  },
  showAllButtonTitle: {
    color: Colors.tintColor,
    fontSize: Styles.primaryFontSize,
  },
  noteButtonsContainer: {
    flexDirection: 'row',
  },
  addNoteButton: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  addNoteOkButton: {
    paddingLeft: 16,
  },
  addNoteButtonTitle: {
    color: Colors.tintColor,
    fontSize: Styles.primaryFontSize,
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
