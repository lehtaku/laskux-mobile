import React, {useCallback, useEffect, useState} from 'react';

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

import {getFileName} from '../../utilities/stringHandling';
import {getFieldError} from '../../utilities/validations';
import {getAttachmentIcon} from '../../utilities/ui';

import {SEND_OFFER_FORM_INITIAL} from '../../constants/States/FormStates';
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

export default function SendOfferScreen({navigation, route}) {
  const offer = route.params?.offer;
  const onSendOffer = route.params?.onSendOffer;

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchEmailTemplatesState = useSelector((store) => store.fetchEmailTemplates);
  const fetchAttachmentsState = useSelector((store) => store.fetchAttachments);
  const fetchCustomerState = useSelector((store) => store.fetchCustomer);

  const sendOfferState = useSelector((store) => store.sendOffer);

  const {showActionSheetWithOptions} = useActionSheet();

  const [formData, setFormData] = useState(SEND_OFFER_FORM_INITIAL);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [scroll, setScroll] = useState(null);
  const [bottomClearFix, setBottomClearFix] = useState(null);

  const [isEdited, setIsEdited] = useState(false);
  const [selectedSavedAttachments, setSelectedSavedAttachments] = useState([]);

  const loadData = useCallback(() => {
    const params = {
      type: 'offer',
      convert: true,
    };
    dispatch(fetchCustomer(account.token, offer.customer.id));
    dispatch(fetchEmailTemplates(params, account.token));
    dispatch(fetchAttachments(account.token));
    dispatch(fetchAccountDetails(account.token));
  }, [dispatch, account.token, offer.customer.id]);

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

  const sendOffer = useCallback(() => {
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
    if (offer.id) {
      emailData = {...emailData, id: offer.id};
    }
    if (onSendOffer) {
      onSendOffer(emailData);
    }
  }, [formData, onSendOffer, selectedSavedAttachments, offer.id]);

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
    return sendOfferState.state === RequestStates.SENDING;
  }, [sendOfferState.state]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  useEffect(() => {
    let headerRight = <InvoiceSendButtons onSend={sendOffer} isSendDisabled={isSending()} />;
    const accountHaveAttachmentsFeature = accountDetails.subscription.plan.features.some(
      ({code}) => code === SUBSCRIPTION_FEATURES.ATTACHMENT_STORAGE,
    );
    if (accountHaveAttachmentsFeature) {
      headerRight = (
        <InvoiceSendButtons
          onAddAttachment={showAttachmentOptions}
          onSend={sendOffer}
          isSendDisabled={isSending()}
        />
      );
    }
    navigation.setOptions({
      gestureEnabled: false,
      title: Translations.SEND_OFFER,
      headerLeft: () => <HeaderLeftCloseButton onPress={closeForm} />,
      headerRight: () => headerRight,
    });
  }, [
    navigation,
    accountDetails.subscription.plan.features,
    sendOffer,
    showAttachmentOptions,
    closeForm,
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
    if (sendOfferState.state === RequestStates.SEND_SUCCESS) {
      return navigation.navigate({name: 'Offers'});
    }
  }, [sendOfferState.state, navigation]);

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

  const openSelector = (params) => {
    navigation.navigate('SelectorScreen', params);
  };

  const checkErrorObject = (parentField, childField) => {
    const errors = [getFieldError(sendOfferState.error, parentField, childField)];
    const error = errors.find((fieldError) => fieldError !== null);
    if (error) {
      return error;
    }
  };

  return (
    <View style={styles.container}>
      {isSending() && <FloatingLoading />}
      <KeyboardAwareScroll innerRef={setScroll}>
        <ListItemDivider title={Translations.GENERAL} topBorder />
        <PlainTextInput
          label={Translations.RECIPIENT}
          value={offer.customer.name}
          topBorder
          disabled
        />

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
