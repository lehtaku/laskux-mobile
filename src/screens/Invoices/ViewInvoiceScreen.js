import React, {useCallback, useContext, useEffect, useState} from 'react';

import {Keyboard, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useActionSheet} from '@expo/react-native-action-sheet';

import {useDispatch, useSelector} from 'react-redux';
import {fetchInvoice} from '../../services/store/actions/invoices/fetchInvoice';
import {viewInvoice} from '../../services/store/actions/invoices/viewInvoice';
import {deleteNote, deleteNoteResetState} from '../../services/store/actions/invoices/deleteNote';
import {addNote, addNoteResetState} from '../../services/store/actions/invoices/addNote';
import {parseCurrencyToLocale, parseDecimalToLocale} from '../../utilities/currencies';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {formatToLocaleDate, formatToLocaleDateTime} from '../../utilities/date';
import Translations from '../../services/localization/Translations';

import System from '../../constants/System';
import Layout from '../../constants/Layout';
import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import RequestStates from '../../constants/States/RequestStates';

import ListItemDivider from '../../components/ListItems/ListItemDivider';
import CustomListItem from '../../components/ListItems/CustomListItem';
import HeaderPreviewButton from '../../components/Buttons/HeaderButtons/HeaderPreviewButton';
import PDFModalViewer from '../../components/Modals/PDFModalViewer';
import TextField from '../../components/ListItems/TextField';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import TextAreaInput from '../../components/Inputs/TextAreaInput';
import ClearFix from '../../components/Layout/ClearFix';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';

export default function ViewInvoiceScreen({navigation, route}) {
  const invoice = route.params?.invoice;
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const fetchInvoiceState = useSelector((store) => store.fetchInvoice);
  const viewInvoiceState = useSelector((store) => store.viewInvoice);
  const addNoteState = useSelector((store) => store.addInvoiceNote);
  const deleteNoteState = useSelector((store) => store.deleteInvoiceNote);

  const {showActionSheetWithOptions} = useActionSheet();
  const {locale, currency} = useContext(LocalizationContext);

  const [isViewInvoiceVisible, setViewInvoiceVisible] = useState(false);
  const [scroll, setScroll] = useState(null);
  const [bottomClearFix, setBottomClearFix] = useState(null);

  const [isNewNoteInputVisible, setIsNewNoteInputVisible] = useState(false);
  const [noteData, setNoteData] = useState(null);

  const loadInvoice = useCallback(
    (isRefreshing) => {
      dispatch(fetchInvoice(invoice.id, account.token, isRefreshing));
    },
    [account.token, dispatch, invoice.id],
  );

  const refresh = useCallback(() => {
    loadInvoice(true);
  }, [loadInvoice]);

  const dispatchViewInvoice = useCallback(() => {
    setViewInvoiceVisible(true);
    dispatch(viewInvoice(account.token, invoice.id));
  }, [account.token, dispatch, invoice.id]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderPreviewButton onPress={dispatchViewInvoice} />,
    });
  }, [navigation, dispatchViewInvoice]);

  useEffect(() => {
    if (addNoteState.state === RequestStates.SUCCESS) {
      setIsNewNoteInputVisible(false);
      setNoteData(null);
      dispatch(addNoteResetState());
      refresh();
    }
  }, [addNoteState.state, dispatch, refresh]);

  useEffect(() => {
    if (deleteNoteState.state === RequestStates.SUCCESS) {
      dispatch(deleteNoteResetState());
      refresh();
    }
  }, [deleteNoteState.state, dispatch, refresh]);

  const dispatchAddNote = () => {
    hideKeyboard();
    const data = {
      note: noteData,
    };
    dispatch(addNote(invoice.id, account.token, data));
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
          dispatch(deleteNote(invoice.id, note.id, account.token));
        }
      },
    );
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
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
    return (
      addNoteState.state === RequestStates.LOADING ||
      deleteNoteState.state === RequestStates.LOADING
    );
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

  const renderContent = () => {
    switch (fetchInvoiceState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_INVOICE} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_INVOICE_FAILED}
            onPressButton={() => loadInvoice()}
          />
        );
      case RequestStates.REFRESHING:
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <KeyboardAwareScroll innerRef={setScroll}>
              <ListItemDivider title={Translations.INVOICE_DETAILS} borders />
              <TextField
                title={Translations.INVOICE_NUMBER}
                rightTitle={fetchInvoiceState.invoice.invoice_number}
              />
              {fetchInvoiceState.invoice.format && (
                <TextField
                  title={Translations.SENDING_METHOD}
                  rightTitle={Translations[fetchInvoiceState.invoice.format.toUpperCase()]}
                />
              )}
              <TextField
                title={Translations.CUSTOMER}
                rightTitle={fetchInvoiceState.invoice.customer.name}
              />
              <TextField
                title={Translations.IN_TOTAL}
                rightTitle={parseCurrencyToLocale(
                  locale.languageTag,
                  currency,
                  fetchInvoiceState.invoice.dynamic_total,
                )}
              />
              <TextField
                title={Translations.INVOICE_DATE}
                rightTitle={formatToLocaleDate(
                  fetchInvoiceState.invoice.invoice_date,
                  locale.languageCode,
                )}
              />
              <TextField
                title={Translations.DUE_DATE}
                rightTitle={formatToLocaleDate(
                  fetchInvoiceState.invoice.due_date,
                  locale.languageCode,
                )}
              />
              <TextField
                title={Translations.PAID_DATE}
                rightTitle={formatToLocaleDate(
                  fetchInvoiceState.invoice.paid_date,
                  locale.languageCode,
                )}
              />
              <TextField
                title={Translations.REFERENCE_NUMBER}
                rightTitle={fetchInvoiceState.invoice.reference_number}
              />
              <TextField
                title={Translations.TERMS_OF_PAYMENT}
                rightTitle={`${fetchInvoiceState.invoice.terms_of_payment} ${Translations.DAYS}`}
              />
              <TextField
                title={Translations.PENALTY_INTEREST}
                rightTitle={`${fetchInvoiceState.invoice.penalty_interest} %`}
              />
              <TextField
                title={Translations.YOUR_REFERENCE}
                rightTitle={fetchInvoiceState.invoice.your_reference}
              />
              <TextField
                title={Translations.MESSAGE}
                rightTitle={fetchInvoiceState.invoice.message}
              />

              <ListItemDivider title={Translations.INVOICE_LINES} borders />
              {fetchInvoiceState.invoice.items.map(
                ({name, quantity, unit, vat_percent, price_with_vat}, index) => (
                  <CustomListItem
                    key={index}
                    title={name}
                    subtitle={`${parseDecimalToLocale(locale.languageTag, currency, quantity)} ${
                      Translations.ITEM_UNITS[unit.toUpperCase()].ABBREVIATION
                    }`}
                    rightTitle={parseCurrencyToLocale(locale.languageTag, currency, price_with_vat)}
                    rightSubtitle={`${Translations.VAT} ${vat_percent} %`}
                    style={styles.invoiceRowItem}
                  />
                ),
              )}
              {fetchInvoiceState.invoice.discount_rows.map(
                ({name, price_with_vat, vat_percent}, index) => (
                  <CustomListItem
                    key={index}
                    title={name}
                    rightTitle={parseCurrencyToLocale(locale.languageTag, currency, price_with_vat)}
                    rightSubtitle={`${Translations.VAT} ${vat_percent} %`}
                    style={styles.invoiceRowItem}
                  />
                ),
              )}

              <ListItemDivider title={Translations.IN_TOTAL} borders />
              <View style={styles.pricesContainer}>
                <TextField
                  title={Translations.SUBTOTAL}
                  rightTitle={parseCurrencyToLocale(
                    locale.languageTag,
                    currency,
                    fetchInvoiceState.invoice.total_price,
                  )}
                  rightTitleStyle={styles.priceText}
                />
                <TextField
                  title={Translations.TOTAL}
                  rightTitle={parseCurrencyToLocale(
                    locale.languageTag,
                    currency,
                    fetchInvoiceState.invoice.total_price_with_vat,
                  )}
                  rightTitleStyle={styles.priceText}
                />
              </View>

              <ListItemDivider
                title={Translations.NOTES}
                rightTitle={renderNoteButtons()}
                borders
              />
              {isNewNoteInputVisible && (
                <TextAreaInput
                  label={Translations.NOTE}
                  value={noteData}
                  onEdit={setNoteData}
                  onSubmitEditing={scrollToBottom}
                  autoFocus
                />
              )}
              <ClearFix innerRef={setBottomClearFix} />
              {fetchInvoiceState.invoice.notes.length < 1 && !isNewNoteInputVisible && (
                <CustomListItem title={Translations.NO_NOTES} bottomDivider />
              )}
              {fetchInvoiceState.invoice.notes.map((item, key) => (
                <TextField
                  key={key}
                  title={formatToLocaleDateTime(item.created_at, locale.languageCode)}
                  onPress={() => showOptions(item)}
                  rightTitle={item.note}
                  bottomDivider
                />
              ))}

              <PDFModalViewer
                isVisible={isViewInvoiceVisible}
                isLoading={viewInvoiceState.state === RequestStates.LOADING}
                source={{
                  uri: 'data:application/pdf;base64,' + viewInvoiceState.pdfData,
                }}
                loadingText={Translations.LOADING_INVOICE}
                onClose={() => setViewInvoiceVisible(false)}
              />
            </KeyboardAwareScroll>
          </View>
        );
      default:
        return null;
    }
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  invoiceRowItem: {
    paddingVertical: 12,
  },
  pricesContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 0,
    paddingBottom: 6,
  },
  priceText: {
    color: Colors.black,
    fontFamily: Styles.fontSemiBold,
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
});
