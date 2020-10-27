import React, {useCallback, useContext, useEffect, useState} from 'react';

import {Alert, BackHandler, Keyboard, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {Image} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';
import {fetchEmailTemplates} from '../../services/store/actions/invoices/fetchEmailTemplates';
import {fetchAttachments} from '../../services/store/actions/attachments/fetchAttachments';
import {fetchCustomer} from '../../services/store/actions/customers/fetchCustomer';
import {fetchAccountDetails} from '../../services/store/actions/account/fetchAccountDetails';
import Translations from '../../services/localization/Translations';

import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {getFileName} from '../../utilities/stringHandling';
import {getFieldError} from '../../utilities/validations';
import {formatDateYYYYMMDD} from '../../utilities/date';
import {parseCurrencyToLocale} from '../../utilities/currencies';
import {getAttachmentIcon} from '../../utilities/ui';

import {INVOICE_FORMATS} from '../../constants/Params/InvoiceParams';
import {SEND_INVOICE_FORM_INITIAL} from '../../constants/States/FormStates';
import {getCountries} from '../../constants/Countries';
import {INVOICE_TYPES} from '../../constants/Types/InvoiceTypes';
import Colors from '../../constants/Colors';
import System from '../../constants/System';
import {SUBSCRIPTION_FEATURES} from '../../constants/Params/SubscriptionParams';
import Layout from '../../constants/Layout';
import RequestStates from '../../constants/States/RequestStates';

import EntypoIcon from '../../components/Icons/EntypoIcon';
import InvoiceSendButtons from '../../components/Buttons/HeaderButtons/InvoiceSendButtons';
import HeaderLeftCloseButton from '../../components/Buttons/HeaderButtons/HeaderLeftCloseButton';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import SelectorInput from '../../components/Inputs/SelectorInput';
import ListItemDivider from '../../components/ListItems/ListItemDivider';
import CustomListItem from '../../components/ListItems/CustomListItem';
import SwitchInput from '../../components/Inputs/SwitchInput';
import Toast from '../../components/Toasts/Toast';
import PlainTextInput from '../../components/Inputs/PlainTextInput';
import TextAreaInput from '../../components/Inputs/TextAreaInput';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import ClearFix from '../../components/Layout/ClearFix';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import DateSelectorInput from '../../components/Inputs/DateSelectorInput';

export default function SendInvoiceScreen({navigation, route}) {
  const invoice = route.params?.invoice;
  const invoiceType = route.params?.invoiceType;
  const onSendInvoice = route.params?.onSendInvoice;

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchEmailTemplatesState = useSelector((store) => store.fetchEmailTemplates);
  const fetchAttachmentsState = useSelector((store) => store.fetchAttachments);
  const fetchCustomerState = useSelector((store) => store.fetchCustomer);

  const createInvoiceState = useSelector((store) => store.createInvoice);
  const editInvoiceState = useSelector((store) => store.editInvoice);
  const sendInvoiceState = useSelector((store) => store.sendInvoice);
  const sendReminderState = useSelector((store) => store.sendInvoiceReminder);
  const sendCreditNoteState = useSelector((store) => store.sendCreditNote);

  const {locale, currency} = useContext(LocalizationContext);
  const {showActionSheetWithOptions} = useActionSheet();

  const [formData, setFormData] = useState(SEND_INVOICE_FORM_INITIAL);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [scroll, setScroll] = useState(null);
  const [bottomClearFix, setBottomClearFix] = useState(null);

  const [isEdited, setIsEdited] = useState(false);
  const [selectedSavedAttachments, setSelectedSavedAttachments] = useState([]);

  const loadData = useCallback(() => {
    const params = {
      type: invoiceType,
      convert: true,
    };
    dispatch(fetchCustomer(account.token, invoice.customer.id));
    dispatch(fetchEmailTemplates(params, account.token));
    dispatch(fetchAttachments(account.token));
    dispatch(fetchAccountDetails(account.token));
  }, [dispatch, invoiceType, account.token, invoice.customer.id]);

  const closeForm = useCallback(() => {
    if (!isEdited) {
      return navigation.goBack();
    }
    return Alert.alert(
      `${Translations.LEAVE_CONFIRM}?`,
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
  }, [isEdited, navigation]);

  const backButtonHandler = useCallback(() => {
    closeForm();
    return true;
  }, [closeForm]);

  const addImage = useCallback((image) => {
    setIsEdited(true);
    setFormData((data) => ({
      ...data,
      attachments: data.attachments.concat({
        name: getFileName(image.path),
        data: `data:${image.mime};base64,${image.data}`,
        save: false,
      }),
    }));
  }, []);

  const openCamera = useCallback(() => {
    ImagePicker.openCamera({
      includeBase64: true,
      compressImageQuality: System.os === 'ios' ? 0.4 : 0.6,
      writeTempFile: false,
    }).then(addImage);
  }, [addImage]);

  const openImagePicker = useCallback(() => {
    ImagePicker.openPicker({
      compressImageQuality: System.os === 'ios' ? 0.4 : 0.6,
      includeBase64: true,
      mediaType: 'image',
      writeTempFile: false,
    }).then(addImage);
  }, [addImage]);

  const sendInvoice = useCallback(() => {
    let emailData = {
      ...formData,
      attachments: formData.attachments.concat(
        selectedSavedAttachments.map((item) => {
          return {
            id: item.id,
          };
        }),
      ),
    };
    if (invoice.id) {
      emailData = {...emailData, id: invoice.id};
    }
    if (onSendInvoice) {
      onSendInvoice(emailData);
    }
  }, [formData, onSendInvoice, selectedSavedAttachments, invoice.id]);

  const addSavedAttachment = useCallback(
    (selectedAttachment) => {
      const attachment = fetchAttachmentsState.attachments.find(
        (attachmentToFind) => attachmentToFind.id === selectedAttachment.value,
      );
      setSelectedSavedAttachments((data) => data.concat(attachment));
    },
    [fetchAttachmentsState.attachments],
  );

  const openSavedAttachmentsSelector = useCallback(() => {
    navigation.navigate('SelectorScreen', {
      title: Translations.SAVED_ATTACHMENTS,
      onSelect: addSavedAttachment,
      iconType: 'plus',
      data: fetchAttachmentsState.attachments.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      }),
    });
  }, [addSavedAttachment, fetchAttachmentsState.attachments, navigation]);

  const showAttachmentOptions = useCallback(() => {
    Keyboard.dismiss();
    const title = Translations.ADD_ATTACHMENT;
    const options = [Translations.TAKE_PHOTO, Translations.CHOOSE_FROM_LIBRARY];
    const icons = [<EntypoIcon name="camera" />, <EntypoIcon name="archive" />];
    if (fetchAttachmentsState.attachments.length > 0) {
      options.push(Translations.SAVED_ATTACHMENTS);
      icons.push(<MaterialIcon name="archive" />);
    }
    options.push(Translations.CANCEL);
    icons.push(<MaterialIcon name="cancel" />);
    const cancelButtonIndex = options.indexOf(Translations.CANCEL);

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
          case options.indexOf(Translations.SAVED_ATTACHMENTS):
            return openSavedAttachmentsSelector();
          default:
            return;
        }
      },
    );
  }, [
    fetchAttachmentsState.attachments.length,
    showActionSheetWithOptions,
    openCamera,
    openImagePicker,
    openSavedAttachmentsSelector,
  ]);

  const isSending = useCallback(() => {
    return (
      createInvoiceState.state === RequestStates.SENDING ||
      editInvoiceState.state === RequestStates.SENDING ||
      sendInvoiceState.state === RequestStates.SENDING ||
      sendReminderState.state === RequestStates.SENDING ||
      sendCreditNoteState.state === RequestStates.SENDING
    );
  }, [
    createInvoiceState.state,
    editInvoiceState.state,
    sendInvoiceState.state,
    sendReminderState.state,
    sendCreditNoteState.state,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (fetchCustomerState.state === RequestStates.SUCCESS) {
      if (fetchCustomerState.customer.primary_invoicing_format) {
        setFormData((data) => ({
          ...data,
          invoice_format: fetchCustomerState.customer.primary_invoicing_format,
        }));
      } else {
        setFormData((data) => ({
          ...data,
          invoice_format: null,
        }));
      }
    }
  }, [dispatch, fetchCustomerState.state, fetchCustomerState.customer]);

  useEffect(() => {
    if (fetchEmailTemplatesState.state === RequestStates.SUCCESS) {
      if (fetchEmailTemplatesState.templates.length === 1) {
        setSelectedTemplate(fetchEmailTemplatesState.templates[0].id);
        setFormData((data) => ({
          ...data,
          email: {
            subject: fetchEmailTemplatesState.templates[0].subject,
            message: fetchEmailTemplatesState.templates[0].message,
          },
        }));
      }
    } else {
      setSelectedTemplate(null);
      setFormData((data) => ({
        ...data,
        email: {
          subject: null,
          message: null,
        },
      }));
    }
  }, [
    fetchEmailTemplatesState.state,
    fetchEmailTemplatesState.templates,
    fetchEmailTemplatesState.templates.length,
  ]);

  const getScreenTitle = useCallback(() => {
    switch (invoiceType) {
      case INVOICE_TYPES.INVOICE:
        return Translations.SEND_INVOICE;
      case INVOICE_TYPES.INVOICE_REMINDER:
        return Translations.SEND_REMINDER;
      case INVOICE_TYPES.CREDIT_NOTE:
        return Translations.SEND_CREDIT_NOTE;
      default:
        return Translations.SEND_INVOICE;
    }
  }, [invoiceType]);

  useEffect(() => {
    let headerRight = <InvoiceSendButtons onSend={sendInvoice} isSendDisabled={isSending()} />;
    const accountHaveAttachmentsFeature = accountDetails.subscription.plan.features.some(
      ({code}) => code === SUBSCRIPTION_FEATURES.ATTACHMENT_STORAGE,
    );
    if (accountHaveAttachmentsFeature && invoiceType === INVOICE_TYPES.INVOICE) {
      headerRight = (
        <InvoiceSendButtons
          onAddAttachment={showAttachmentOptions}
          onSend={sendInvoice}
          isSendDisabled={isSending() || !formData.invoice_format}
        />
      );
    }
    navigation.setOptions({
      gestureEnabled: false,
      title: getScreenTitle(),
      headerLeft: () => <HeaderLeftCloseButton onPress={closeForm} />,
      headerRight: () => headerRight,
    });
  }, [
    navigation,
    accountDetails.subscription.plan.features,
    formData.invoice_format,
    sendInvoice,
    showAttachmentOptions,
    closeForm,
    invoiceType,
    getScreenTitle,
    isSending,
  ]);

  useFocusEffect(() => {
    if (System.os === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }
  }, [backButtonHandler]);

  useEffect(() => {
    if (
      sendInvoiceState.state === RequestStates.SEND_SUCCESS ||
      sendReminderState.state === RequestStates.SEND_SUCCESS ||
      sendCreditNoteState.state === RequestStates.SEND_SUCCESS
    ) {
      return navigation.navigate({name: 'Invoices'});
    }
  }, [sendInvoiceState.state, sendReminderState.state, sendCreditNoteState.state, navigation]);

  const emitChanges = (newData) => {
    setIsEdited(true);
    setFormData((data) => ({
      ...data,
      ...newData,
    }));
  };

  const changeTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    const selected = fetchEmailTemplatesState.templates.find(
      (template) => template.id === templateId,
    );
    if (!selected) {
      return emitChanges({
        email: {
          subject: null,
          message: null,
        },
      });
    }
    emitChanges({
      email: {
        subject: selected.subject,
        message: selected.message,
      },
    });
  };

  const switchSaveAttachment = (index, value) => {
    const attachmentsClone = [...formData.attachments];
    attachmentsClone[index].save = value;
    emitChanges({attachments: attachmentsClone});
  };

  const deleteAttachment = (attachmentIndex) => {
    emitChanges({
      attachments: formData.attachments.filter((item, index) => index !== attachmentIndex),
    });
  };

  const deleteSavedAttachment = (attachmentIndex) => {
    setSelectedSavedAttachments((data) => data.filter((item, index) => index !== attachmentIndex));
  };

  const haveTooManyAttachments = () => {
    return formData.attachments.length + selectedSavedAttachments.length > 5;
  };

  const isAttachmentsSizeTooLarge = () => {
    let size = 0;
    let padding = 0;
    for (let i = 0; i < formData.attachments.length; i++) {
      if (formData.attachments[i].data.endsWith('==')) {
        padding = 2;
      } else {
        padding = 1;
      }
      size += formData.attachments[i].data.length * (3 / 4) - padding;
    }
    return size > 10000000;
  };

  const checkAttachmentErrors = () => {
    if (haveTooManyAttachments()) {
      return (
        <Toast
          message={`${Translations.TOO_MANY_ATTACHMENTS} 5 ${Translations.PIECES}`}
          type="danger"
        />
      );
    } else if (isAttachmentsSizeTooLarge()) {
      return <Toast message={`${Translations.TOO_LARGE_ATTACHMENTS} 10MB`} type="danger" />;
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

  const isFormatAvailable = (formatValue) => {
    const accountHaveAvailableFormat = accountDetails.details.available_invoicing_formats.some(
      (formatToFind) => formatToFind === formatValue,
    );
    const customerHaveAvailableFormat = fetchCustomerState.customer.available_invoicing_formats.some(
      (formatToFind) => formatToFind === formatValue,
    );
    const isTrial = accountDetails.subscription.is_trial;
    const accountHaveEInvoiceCredits = accountDetails.subscription.credits_e_invoice_sending > 0;
    const accountHavePaperInvoiceCredits =
      accountDetails.subscription.credits_paper_invoice_sending > 0;
    switch (formatValue) {
      case INVOICE_FORMATS.EMAIL:
        return accountHaveAvailableFormat && customerHaveAvailableFormat;
      case INVOICE_FORMATS.E_INVOICE:
        const isOriginalEInvoice = invoice.format === INVOICE_FORMATS.E_INVOICE;
        const isCreditNote = invoiceType === INVOICE_TYPES.CREDIT_NOTE;
        const isReminder = invoiceType === INVOICE_TYPES.INVOICE_REMINDER;
        if (isTrial && !accountHaveEInvoiceCredits) {
          return false;
        } else if ((isCreditNote || isReminder) && !isOriginalEInvoice) {
          return false;
        }
        return accountHaveAvailableFormat && customerHaveAvailableFormat;
      case INVOICE_FORMATS.PAPER:
        if (isTrial && !accountHavePaperInvoiceCredits) {
          return false;
        }
        return accountHaveAvailableFormat && customerHaveAvailableFormat;
      default:
        return;
    }
  };

  const getInvoiceFormats = () => {
    let eInvoiceLabel = Translations.E_INVOICE;
    let paperInvoiceLabel = Translations.PAPER;
    if (
      accountDetails.subscription.is_trial ||
      accountDetails.subscription.credits_e_invoice_sending > 0
    ) {
      eInvoiceLabel = `${eInvoiceLabel} (${Translations.FREE_E_INVOICES} ${accountDetails.subscription.credits_e_invoice_sending} ${Translations.PIECES})`;
    }
    if (
      accountDetails.subscription.is_trial ||
      accountDetails.subscription.credits_paper_invoice_sending > 0
    ) {
      paperInvoiceLabel = `${paperInvoiceLabel} (${Translations.FREE_PAPER_INVOICES} ${accountDetails.subscription.credits_paper_invoice_sending} ${Translations.PIECES})`;
    }
    const accountHaveEInvoicesFeature = accountDetails.subscription.plan.features.some(
      ({code}) => code === SUBSCRIPTION_FEATURES.E_INVOICES,
    );
    const accountHavePaperInvoicesFeature = accountDetails.subscription.plan.features.some(
      ({code}) => code === SUBSCRIPTION_FEATURES.PAPER_INVOICES,
    );
    const formats = [
      {
        label: Translations.EMAIL,
        value: INVOICE_FORMATS.EMAIL,
        disabled: !isFormatAvailable(INVOICE_FORMATS.EMAIL),
      },
    ];
    if (accountHaveEInvoicesFeature) {
      formats.push({
        label: eInvoiceLabel,
        description: `(${parseCurrencyToLocale(
          locale.languageTag,
          currency,
          accountDetails.prices.sent_e_invoices,
        )} / ${Translations.PIECES})`,
        value: INVOICE_FORMATS.E_INVOICE,
        disabled: !isFormatAvailable(INVOICE_FORMATS.E_INVOICE),
      });
    }
    if (accountHavePaperInvoicesFeature) {
      formats.push({
        label: paperInvoiceLabel,
        description: `(${parseCurrencyToLocale(
          locale.languageTag,
          currency,
          accountDetails.prices.sent_paper_invoices,
        )} / ${Translations.PIECES} + ${Translations.ADDITIONAL_PAGES} ${parseCurrencyToLocale(
          locale.languageTag,
          currency,
          accountDetails.prices.sent_paper_invoices_extra_pages,
        )} / ${Translations.PAGE})`,
        value: INVOICE_FORMATS.PAPER,
        disabled: !isFormatAvailable(INVOICE_FORMATS.PAPER),
      });
    }
    return formats;
  };

  const getCustomerCountry = () => {
    const localizedCountries = getCountries(locale.countryCode);
    for (let [key, value] of Object.entries(localizedCountries)) {
      if (key === fetchCustomerState.customer.country_code) {
        return value;
      }
    }
  };

  const openSelector = (params) => {
    navigation.navigate('SelectorScreen', params);
  };

  const checkErrorObject = (parentField, childField) => {
    const errors = [
      getFieldError(createInvoiceState.error, parentField, childField),
      getFieldError(editInvoiceState.error, parentField, childField),
      getFieldError(sendInvoiceState.error, parentField, childField),
      getFieldError(sendReminderState.error, parentField, childField),
      getFieldError(sendCreditNoteState.error, parentField, childField),
    ];
    const error = errors.find((fieldError) => fieldError !== null);
    if (error) {
      return error;
    }
  };

  const EmailForm = () => (
    <>
      <ListItemDivider title={Translations.EMAIL} />
      <PlainTextInput
        label={Translations.RECEIVER}
        value={fetchCustomerState.customer.email}
        topBorder
        disabled
      />
      {fetchEmailTemplatesState.templates.length > 1 && (
        <SelectorInput
          placeholder={Translations.SELECT_EMAIL_TEMPLATE}
          label={Translations.EMAIL_TEMPLATES}
          value={selectedTemplate}
          onSelect={changeTemplate}
          data={fetchEmailTemplatesState.templates.map((template) => {
            return {
              label: template.name,
              value: template.id,
            };
          })}
          onPress={openSelector}
        />
      )}

      <PlainTextInput
        label={Translations.SUBJECT}
        onEdit={(value) => emitChanges({email: {...formData.email, subject: value}})}
        value={formData.email.subject}
        error={checkErrorObject('email', 'subject')}
        maxLength={200}
      />
      <TextAreaInput
        value={formData.email.message}
        onSubmitEditing={scrollToBottom}
        maxLength={1000}
        label={Translations.MESSAGE}
        onEdit={(value) => emitChanges({email: {...formData.email, message: value}})}
        error={checkErrorObject('email', 'message')}
      />
      <ClearFix innerRef={setBottomClearFix} />
    </>
  );

  const E_InvoiceForm = () => (
    <>
      <ListItemDivider title={Translations.E_INVOICE} />
      <PlainTextInput
        label={Translations.E_INVOICING_OPERATOR}
        value={fetchCustomerState.customer.e_invoicing_operator.name}
        topBorder
        disabled
      />
      <PlainTextInput
        label={Translations.ADDRESS}
        value={fetchCustomerState.customer.e_invoicing_address}
        disabled
      />
    </>
  );

  const PaperInvoiceForm = () => (
    <>
      <ListItemDivider title={Translations.PAPER} />
      <PlainTextInput
        label={Translations.STREET}
        value={fetchCustomerState.customer.address}
        topBorder
        disabled
      />
      <PlainTextInput label={Translations.CITY} value={fetchCustomerState.customer.city} disabled />
      <PlainTextInput
        label={Translations.ZIP_CODE}
        value={fetchCustomerState.customer.zip_code}
        disabled
      />
      <PlainTextInput label={Translations.COUNTRY} value={getCustomerCountry()} disabled />
    </>
  );

  const renderForm = () => {
    switch (formData.invoice_format) {
      case INVOICE_FORMATS.EMAIL:
        return EmailForm();
      case INVOICE_FORMATS.E_INVOICE:
        return E_InvoiceForm();
      case INVOICE_FORMATS.PAPER:
        return PaperInvoiceForm();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {isSending() && <FloatingLoading />}
      <KeyboardAwareScroll innerRef={setScroll}>
        <ListItemDivider title={Translations.GENERAL} topBorder />
        <PlainTextInput
          label={Translations.RECIPIENT}
          value={invoice.customer.name}
          topBorder
          disabled
        />
        <SelectorInput
          placeholder={Translations.SELECT_SENDING_METHOD}
          label={Translations.SENDING_METHOD}
          value={formData.invoice_format}
          onSelect={(value) => emitChanges({invoice_format: value})}
          data={getInvoiceFormats()}
          onPress={openSelector}
        />

        {invoiceType === INVOICE_TYPES.CREDIT_NOTE && (
          <DateSelectorInput
            label={Translations.PAID_DATE}
            tooltip={Translations.PAID_DATE_TOOLTIP}
            value={new Date(formData.paid_date)}
            onSelect={(value) => emitChanges({paid_date: formatDateYYYYMMDD(value)})}
            maxDate={new Date()}
            minDate={new Date(invoice.invoice_date)}
          />
        )}

        {renderForm()}

        {(formData.attachments.length > 0 || selectedSavedAttachments.length > 0) && (
          <>
            <ListItemDivider title={Translations.ATTACHMENTS} bottomBorder />
            {checkAttachmentErrors()}
          </>
        )}
        {formData.attachments.map((item, index) => (
          <CustomListItem
            title={item.name}
            key={index}
            leftIcon={<Image source={{uri: item.data}} style={styles.attachmentThumbnail} />}
            style={styles.attachmentItem}
            subtitle={
              <View style={styles.attachmentSwitchContainer}>
                <SwitchInput
                  label={Translations.SAVE_ATTACHMENT}
                  style={styles.attachmentSwitch}
                  value={item.save}
                  onChange={(value) => switchSaveAttachment(index, value)}
                  disablePadding
                />
              </View>
            }
            onPressDelete={() => deleteAttachment(index)}
            bottomDivider
          />
        ))}

        {selectedSavedAttachments.map(({description, mime_type, name}, index) => (
          <CustomListItem
            title={name}
            subtitle={description}
            key={index}
            style={styles.attachmentItem}
            leftIcon={getAttachmentIcon(mime_type)}
            onPressDelete={() => deleteSavedAttachment(index)}
            bottomDivider
          />
        ))}
      </KeyboardAwareScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  attachmentItem: {
    paddingHorizontal: 12,
  },
  attachmentThumbnail: {
    height: 85,
    width: 65,
  },
  attachmentSwitchContainer: {
    minWidth: '100%',
  },
  attachmentSwitch: {
    marginVertical: 6,
  },
});
