import React, {useCallback, useContext, useEffect, useState} from 'react';

import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import FileViewer from 'react-native-file-viewer';

import {useDispatch, useSelector} from 'react-redux';
import {viewReceivedInvoice} from '../../services/store/actions/invoices/viewReceivedInvoice';
import {parseCurrencyToLocale} from '../../utilities/currencies';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {
  fetchSingleAttachment,
  fetchSingleAttachmentResetState,
} from '../../services/store/actions/invoices/fetchSingleAttachment';
import {formatToLocaleDate} from '../../utilities/date';
import {getAttachmentIcon} from '../../utilities/ui';
import Translations from '../../services/localization/Translations';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import RequestStates from '../../constants/States/RequestStates';
import {dangerAnimation} from '../../constants/Animations';

import ListItemDivider from '../../components/ListItems/ListItemDivider';
import HeaderPreviewButton from '../../components/Buttons/HeaderButtons/HeaderPreviewButton';
import PDFModalViewer from '../../components/Modals/PDFModalViewer';
import TextField from '../../components/ListItems/TextField';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import CustomListItem from '../../components/ListItems/CustomListItem';
import CustomDivider from '../../components/Layout/CustomDivider';

const RNFS = require('react-native-fs');

export default function ViewReceivedInvoiceScreen({navigation, route}) {
  const invoice = route.params?.invoice;
  const attachments = route.params?.invoice.attachments ?? [];
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const viewReceivedInvoiceState = useSelector((store) => store.viewReceivedInvoice);
  const fetchSingleAttachmentState = useSelector((store) => store.fetchSingleAttachment);

  const dangerToast = useSelector((store) => store.showToast.dangerToast);
  const {locale} = useContext(LocalizationContext);

  const [isViewInvoiceVisible, setViewInvoiceVisible] = useState(false);

  const dispatchViewInvoice = useCallback(() => {
    setViewInvoiceVisible(true);
    dispatch(viewReceivedInvoice(account.token, invoice.id));
  }, [account.token, dispatch, invoice.id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderPreviewButton onPress={dispatchViewInvoice} />,
    });
  }, [navigation, dispatchViewInvoice]);

  useEffect(() => {
    if (fetchSingleAttachmentState.state === RequestStates.SUCCESS) {
      const writeAndOpenFile = async () => {
        const path = `${RNFS.DocumentDirectoryPath}/${fetchSingleAttachmentState.attachment.name}`;
        const file = fetchSingleAttachmentState.attachment.file;
        await RNFS.writeFile(path, file, 'base64');
        await FileViewer.open(path);
      };
      writeAndOpenFile()
        .then(() => dispatch(fetchSingleAttachmentResetState()))
        .catch(() =>
          dispatch(dangerToast.show(Translations.OPEN_ATTACHMENT_FAILED, dangerAnimation)),
        );
    }
  }, [
    dangerToast,
    dispatch,
    fetchSingleAttachmentState.attachment.file,
    fetchSingleAttachmentState.attachment.name,
    fetchSingleAttachmentState.state,
  ]);

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <KeyboardAwareScroll>
          <ListItemDivider title={Translations.INVOICE_DETAILS} borders />
          <TextField title={Translations.NAME} rightTitle={invoice.name} />
          <TextField title={Translations.ACCOUNT_NUMBER} rightTitle={invoice.iban} />
          <TextField title={Translations.BIC} rightTitle={invoice.bic} />
          <TextField
            title={Translations.DUE_DATE}
            rightTitle={formatToLocaleDate(invoice.due_date, locale.languageCode)}
          />
          <TextField title={Translations.REFERENCE_NUMBER} rightTitle={invoice.reference_number} />
          <TextField
            title={Translations.IN_TOTAL}
            rightTitle={parseCurrencyToLocale(
              locale.languageTag,
              invoice.currency,
              invoice.total_price,
            )}
          />
          <TextField
            title={Translations.PAID_DATE}
            rightTitle={formatToLocaleDate(invoice.paid_date, locale.languageCode)}
          />
          {attachments.length > 0 && (
            <ListItemDivider title={Translations.ATTACHMENTS} topBorder bottomBorder />
          )}
          {attachments.map(({id, name, mime_type}, index) => (
            <CustomListItem
              key={index}
              title={name}
              leftIcon={getAttachmentIcon(mime_type)}
              rightTitle={
                <Button
                  onPress={() => dispatch(fetchSingleAttachment(invoice.id, id, account.token))}
                  title={Translations.OPEN_ATTACHMENT}
                  buttonStyle={styles.attachmentButton}
                  titleStyle={styles.attachmentButtonTitle}
                  loading={
                    fetchSingleAttachmentState.attachmentId === id &&
                    fetchSingleAttachmentState.state === RequestStates.LOADING
                  }
                  loadingProps={{color: Colors.tintColor}}
                />
              }
            />
          ))}
          <CustomDivider margin={0} />

          <PDFModalViewer
            isVisible={isViewInvoiceVisible}
            isLoading={viewReceivedInvoiceState.state === RequestStates.LOADING}
            source={{
              uri: 'data:application/pdf;base64,' + viewReceivedInvoiceState.pdfData,
            }}
            loadingText={Translations.LOADING_INVOICE}
            onClose={() => setViewInvoiceVisible(false)}
          />
        </KeyboardAwareScroll>
      </View>
    );
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  attachmentButton: {
    backgroundColor: 'transparent',
  },
  attachmentButtonTitle: {
    color: Colors.tintColor,
    fontSize: Styles.primaryFontSize,
  },
});
