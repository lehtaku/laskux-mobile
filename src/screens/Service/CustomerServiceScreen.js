import React, {useEffect, useState} from 'react';

import {StyleSheet, Linking, Keyboard, View} from 'react-native';
import {Button} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';
import {sendEmail, sendEmailResetState} from '../../services/store/actions/service/sendEmail';
import Translations from '../../services/localization/Translations';

import {dangerAnimation} from '../../constants/Animations';
import Colors from '../../constants/Colors';
import System from '../../constants/System';
import RequestStates from '../../constants/States/RequestStates';
import Layout from '../../constants/Layout';
import {COMPANY_CONTACT} from '../../constants/Params/CustomerServiceParams';
import {getFieldError} from '../../utilities/validations';

import TitleText from '../../components/Text/TitleText';
import PrimaryText from '../../components/Text/PrimaryText';
import CustomListItem from '../../components/ListItems/CustomListItem';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import PlainTextInput from '../../components/Inputs/PlainTextInput';
import TextAreaInput from '../../components/Inputs/TextAreaInput';
import ClearFix from '../../components/Layout/ClearFix';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import Toast from '../../components/Toasts/Toast';

export default function CustomerServiceScreen({navigation}) {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const personalDetails = useSelector((store) => store.fetchPersonalDetails);
  const sendEmailState = useSelector((store) => store.sendEmail);

  const dangerToast = useSelector((store) => store.showToast.dangerToast);

  const [scroll, setScroll] = useState(null);
  const [bottomClearFix, setBottomClearFix] = useState(null);

  const [formData, setFormData] = useState({
    name: null,
    company: null,
    email: null,
    subject: null,
    message: null,
  });

  const callToCustomerService = async () => {
    try {
      let formattedNumber;
      if (System.os === 'ios') {
        formattedNumber = `telprompt:${COMPANY_CONTACT.PHONE}`;
      } else {
        formattedNumber = `tel:${COMPANY_CONTACT.PHONE}`;
      }
      await Linking.openURL(formattedNumber);
    } catch (error) {
      dangerToast.show(Translations.OPENING_PHONE_FAILED, dangerAnimation);
    }
  };

  const mailToCustomerService = async () => {
    try {
      await Linking.openURL(`mailto:${COMPANY_CONTACT.EMAIL}`);
    } catch (error) {
      dangerToast.show(Translations.OPENING_EMAIL_FAILED, dangerAnimation);
    }
  };

  useEffect(() => {
    navigation.addListener('blur', () => {
      dispatch(sendEmailResetState());
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (
      accountDetails.state === RequestStates.SUCCESS &&
      personalDetails.state === RequestStates.SUCCESS
    ) {
      setFormData((data) => ({
        ...data,
        company: accountDetails.details.name,
        email: personalDetails.details.email,
        name: personalDetails.details.name,
      }));
    }
  }, [
    accountDetails.state,
    personalDetails.state,
    personalDetails.details.email,
    accountDetails.details.name,
    personalDetails.details.name,
  ]);

  const dispatchSendEmail = () => {
    Keyboard.dismiss();
    dispatch(sendEmail(account.token, formData));
  };

  const emitChanges = (newData) => {
    setFormData((data) => ({...data, ...newData}));
  };

  const renderToast = () => {
    if (sendEmailState.state === RequestStates.SUCCESS) {
      return <Toast type="success" message={Translations.EMAIL_SENT_SUCCESS} />;
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

  const isLoading = () => {
    return sendEmailState.state === RequestStates.LOADING;
  };

  return (
    <KeyboardAwareScroll innerRef={setScroll}>
      {isLoading() && <FloatingLoading />}
      <View style={styles.description}>
        <TitleText text={`${Translations.NEED_HELP}?`} />
        <PrimaryText text={Translations.NEED_HELP_DESCRIPTION} />
      </View>
      <CustomListItem
        onPress={callToCustomerService}
        leftIcon={<AntDesignIcon name="phone" />}
        title={`${Translations.CALL_TO_US} (${Translations.OPENING_HOURS})`}
        subtitle={COMPANY_CONTACT.PHONE}
        subtitleStyle={styles.listItemSubtitle}
        topDivider
        bottomDivider
        chevron
      />
      <CustomListItem
        onPress={mailToCustomerService}
        leftIcon={<AntDesignIcon name="mail" />}
        title={Translations.SEND_EMAIL}
        subtitle={COMPANY_CONTACT.EMAIL}
        subtitleStyle={styles.listItemSubtitle}
        bottomDivider
        chevron
      />

      <View style={styles.description}>
        <TitleText text={Translations.CONTACT_FORM} />
        <PrimaryText text={Translations.CONTACT_FORM_DESCRIPTION} />
      </View>
      {renderToast()}
      <PlainTextInput label={Translations.NAME} value={formData.name} topBorder disabled />
      <PlainTextInput label={Translations.COMPANY} value={formData.company} disabled />
      <PlainTextInput label={Translations.EMAIL} value={formData.email} disabled />
      <PlainTextInput
        label={Translations.SUBJECT}
        value={formData.subject}
        onEdit={(value) => emitChanges({subject: value})}
        error={getFieldError(sendEmailState.error, 'subject')}
      />
      <TextAreaInput
        label={Translations.MESSAGE}
        value={formData.message}
        onEdit={(value) => emitChanges({message: value})}
        onSubmitEditing={scrollToBottom}
        error={getFieldError(sendEmailState.error, 'message')}
      />
      <ClearFix innerRef={setBottomClearFix} />
      <Button
        onPress={dispatchSendEmail}
        title={Translations.SEND}
        containerStyle={styles.sendButtonContainer}
        buttonStyle={styles.sendButton}
      />
    </KeyboardAwareScroll>
  );
}

const styles = StyleSheet.create({
  description: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'solid',
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  listItemSubtitle: {
    color: Colors.tintColor,
  },
  sendButtonContainer: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
  sendButton: {
    paddingVertical: 12,
  },
});
