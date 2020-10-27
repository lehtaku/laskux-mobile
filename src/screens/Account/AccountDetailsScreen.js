import React, {useCallback, useEffect, useState} from 'react';

import {Button} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ImagePicker from 'react-native-image-crop-picker';

import {useDispatch, useSelector} from 'react-redux';
import {fetchAccountDetails} from '../../services/store/actions/account/fetchAccountDetails';
import {
  updateAccountDetails,
  updateAccountDetailsResetState,
} from '../../services/store/actions/account/updateAccountDetails';
import {getFieldError} from '../../utilities/validations';
import Translations from '../../services/localization/Translations';

import {dangerAnimation, successAnimation} from '../../constants/Animations';
import RequestStates from '../../constants/States/RequestStates';
import Colors from '../../constants/Colors';

import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import EntypoIcon from '../../components/Icons/EntypoIcon';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import PlainTextInput from '../../components/Inputs/PlainTextInput';
import EmailInput from '../../components/Inputs/EmailInput';
import NumberInput from '../../components/Inputs/NumberInput';
import ListItemDivider from '../../components/ListItems/ListItemDivider';
import CustomListItem from '../../components/ListItems/CustomListItem';
import BottomSafeAreaContainer from '../../components/Layout/BottomSafeAreaContainer';
import Logo from '../../components/Layout/Logo';

export default function AccountDetailsScreen({navigation}) {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const updateAccountDetailsState = useSelector((store) => store.updateAccountDetails);
  const fetchLogoState = useSelector((store) => store.fetchLogo);

  const successToast = useSelector((store) => store.showToast.successToast);
  const dangerToast = useSelector((store) => store.showToast.dangerToast);

  const {showActionSheetWithOptions} = useActionSheet();

  const [formData, setFormData] = useState({
    name: null,
    business_id: null,
    vat_id: null,
    address: null,
    zip_code: null,
    city: null,
    email: null,
    phone: null,
    fax: null,
    www: null,
    logo: fetchLogoState.logoData,
  });

  const loadData = useCallback(() => {
    dispatch(fetchAccountDetails(account.token));
  }, [account.token, dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(updateAccountDetailsResetState());
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (accountDetails.state === RequestStates.SUCCESS) {
      const details = accountDetails.details;
      setFormData((data) => ({
        ...data,
        name: details.name,
        business_id: details.business_id,
        vat_id: details.vat_id,
        address: details.address,
        zip_code: details.zip_code,
        city: details.city,
        email: details.email,
        phone: details.phone,
        fax: details.fax,
        www: details.www,
      }));
    }
  }, [accountDetails.details, accountDetails.state]);

  const dispatchUpdateDetails = () => {
    dispatch(updateAccountDetails(account.token, formData));
  };

  useEffect(() => {
    if (updateAccountDetailsState.state === RequestStates.SUCCESS) {
      successToast.show(Translations.SAVE_DETAILS_SUCCESS, successAnimation);
      return navigation.goBack();
    } else if (updateAccountDetailsState.state === RequestStates.ERROR) {
      if (getFieldError(updateAccountDetailsState.error, 'logo')) {
        return dangerToast.show(
          getFieldError(updateAccountDetailsState.error, 'logo'),
          dangerAnimation,
        );
      }
    }
  }, [
    loadData,
    dangerToast,
    navigation,
    successToast,
    updateAccountDetailsState.error,
    updateAccountDetailsState.state,
  ]);

  const addImage = useCallback((image) => {
    setFormData((data) => ({
      ...data,
      logo: `data:${image.mime};base64,${image.data}`,
    }));
  }, []);

  const openCamera = useCallback(() => {
    ImagePicker.openCamera({
      compressImageQuality: 0.4,
      cropping: true,
      includeBase64: true,
      width: 600,
      height: 600,
    }).then(addImage);
  }, [addImage]);

  const openImagePicker = useCallback(() => {
    ImagePicker.openPicker({
      compressImageQuality: 0.4,
      cropping: true,
      mediaType: 'image',
      includeBase64: true,
      width: 600,
      height: 600,
    }).then(addImage);
  }, [addImage]);

  const showAttachmentOptions = useCallback(() => {
    const title = Translations.ADD_LOGO;
    const options = [
      Translations.TAKE_PHOTO,
      Translations.CHOOSE_FROM_LIBRARY,
      Translations.CANCEL,
    ];
    const cancelButtonIndex = options.indexOf(Translations.CANCEL);
    const icons = [
      <EntypoIcon name="camera" />,
      <EntypoIcon name="archive" />,
      <MaterialIcon name="cancel" />,
    ];

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
        tintColor: Colors.tintColor,
        icons,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case options.indexOf(Translations.TAKE_PHOTO):
            return openCamera();
          case options.indexOf(Translations.CHOOSE_FROM_LIBRARY):
            return openImagePicker();
          default:
            return;
        }
      },
    );
  }, [openCamera, openImagePicker, showActionSheetWithOptions]);

  const emitChanges = (newData) => {
    setFormData((data) => ({...data, ...newData}));
  };

  const isLoading = () => {
    return updateAccountDetailsState.state === RequestStates.LOADING;
  };

  const renderReceivingPaperInvoices = () => {
    const item = accountDetails.invoice_receiving.paper_invoices;
    if (
      item.hasOwnProperty('name') &&
      item.hasOwnProperty('address_line1') &&
      item.hasOwnProperty('address_line2') &&
      item.hasOwnProperty('address_line3')
    ) {
      return (
        <>
          <ListItemDivider title={Translations.INVOICE_RECEIVING_PAPER_INVOICES} bottomBorder />
          <PlainTextInput
            label={Translations.NAME}
            value={accountDetails.invoice_receiving.paper_invoices.name}
            disabled
          />
          <PlainTextInput
            label={`${Translations.ADDRESS_LINE} 1`}
            value={accountDetails.invoice_receiving.paper_invoices.address_line1}
            disabled
          />
          <PlainTextInput
            label={`${Translations.ADDRESS_LINE} 2`}
            value={accountDetails.invoice_receiving.paper_invoices.address_line2}
            disabled
          />
          <PlainTextInput
            label={`${Translations.ADDRESS_LINE} 3`}
            value={accountDetails.invoice_receiving.paper_invoices.address_line3}
            disabled
            bottomDivider
          />
        </>
      );
    }
  };

  const renderReceivingEInvoices = () => {
    const item = accountDetails.invoice_receiving.e_invoices;
    if (
      item.hasOwnProperty('operator_name') &&
      item.hasOwnProperty('operator_code') &&
      item.hasOwnProperty('e_invoicing_address')
    ) {
      return (
        <>
          <ListItemDivider title={Translations.INVOICE_RECEIVING_E_INVOICES} bottomBorder />
          <PlainTextInput
            label={Translations.E_INVOICING_OPERATOR}
            value={accountDetails.invoice_receiving.e_invoices.operator_name}
            disabled
          />
          <PlainTextInput
            label={Translations.E_INVOICING_OPERATOR_CODE}
            value={accountDetails.invoice_receiving.e_invoices.operator_code}
            disabled
          />
          <PlainTextInput
            label={Translations.E_INVOICING_ADDRESS}
            value={accountDetails.invoice_receiving.e_invoices.e_invoicing_address}
            disabled
            bottomDivider
          />
        </>
      );
    }
  };

  const renderContent = () => {
    switch (accountDetails.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_DETAILS} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            onPressButton={loadData}
            message={Translations.LOADING_DETAILS_FAILED}
          />
        );
      case RequestStates.SUCCESS:
        return (
          <BottomSafeAreaContainer>
            {isLoading() && <FloatingLoading />}
            <KeyboardAwareScroll>
              <ListItemDivider title={Translations.GENERAL} topBorder />

              <PlainTextInput
                label={Translations.BUSINESS_NAME}
                value={formData.name}
                onEdit={(value) => emitChanges({name: value})}
                error={getFieldError(updateAccountDetailsState.error, 'name')}
                topBorder
              />

              <PlainTextInput
                label={Translations.BUSINESS_ID}
                value={formData.business_id}
                onEdit={(value) => emitChanges({business_id: value})}
                error={getFieldError(updateAccountDetailsState.error, 'business_id')}
              />

              <PlainTextInput
                label={Translations.VAT_ID}
                value={formData.vat_id}
                onEdit={(value) => emitChanges({vat_id: value})}
                error={getFieldError(updateAccountDetailsState.error, 'vat_id')}
              />

              <EmailInput
                label={Translations.EMAIL}
                value={formData.email}
                onEdit={(value) => emitChanges({email: value})}
                error={getFieldError(updateAccountDetailsState.error, 'email')}
              />

              <NumberInput
                label={Translations.PHONE}
                value={formData.phone}
                onEdit={(value) => emitChanges({phone: value})}
                error={getFieldError(updateAccountDetailsState.error, 'phone')}
                keyboardType="phone-pad"
              />

              <PlainTextInput
                label={Translations.FAX}
                value={formData.fax}
                onEdit={(value) => emitChanges({fax: value})}
                error={getFieldError(updateAccountDetailsState.error, 'fax')}
              />

              <PlainTextInput
                label={Translations.HOMEPAGE}
                value={formData.www}
                onEdit={(value) => emitChanges({www: value})}
                error={getFieldError(updateAccountDetailsState.error, 'www')}
              />

              <ListItemDivider title={Translations.ADDRESS_DETAILS} />

              <PlainTextInput
                label={Translations.ADDRESS}
                value={formData.address}
                onEdit={(value) => emitChanges({address: value})}
                error={getFieldError(updateAccountDetailsState.error, 'address')}
                topBorder
              />

              <NumberInput
                label={Translations.ZIP_CODE}
                value={formData.zip_code}
                onEdit={(value) => emitChanges({zip_code: value})}
                error={getFieldError(updateAccountDetailsState.error, 'zip_code')}
                keyboardType="phone-pad"
              />

              <PlainTextInput
                label={Translations.CITY}
                value={formData.city}
                onEdit={(value) => emitChanges({city: value})}
                error={getFieldError(updateAccountDetailsState.error, 'city')}
              />

              {renderReceivingPaperInvoices()}
              {renderReceivingEInvoices()}

              <ListItemDivider title={Translations.LAYOUT} />

              {formData.logo ? (
                <CustomListItem
                  title={Translations.LOGO}
                  onPress={showAttachmentOptions}
                  leftIcon={<Logo source={{uri: formData.logo}} />}
                  onPressDelete={() => emitChanges({logo: null})}
                  options
                  topDivider
                  bottomDivider
                />
              ) : (
                <CustomListItem
                  title={Translations.LOGO}
                  onPress={showAttachmentOptions}
                  leftIcon={<Logo />}
                  topDivider
                  bottomDivider
                  options
                />
              )}
            </KeyboardAwareScroll>
            <View style={styles.bottomContainer}>
              <Button
                onPress={dispatchUpdateDetails}
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
  addLogoItem: {
    paddingRight: 8,
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
