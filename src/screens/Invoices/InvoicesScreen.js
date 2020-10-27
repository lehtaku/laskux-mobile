import React, {useCallback, useEffect, useState} from 'react';

import {View, StyleSheet, Alert, BackHandler} from 'react-native';
import {Button} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';

import {useActionSheet} from '@expo/react-native-action-sheet';

import {useSelector, useDispatch} from 'react-redux';
import {fetchInvoices} from '../../services/store/actions/invoices/fetchInvoices';
import {
  sendInvoice,
  sendInvoiceResetState,
} from '../../services/store/actions/invoices/sendInvoice';
import {markAsPaid, markAsPaidResetState} from '../../services/store/actions/invoices/markAsPaid';
import {
  deleteInvoice,
  deleteInvoiceResetState,
} from '../../services/store/actions/invoices/deleteInvoice';
import {
  sendToCollection,
  sendToCollectionResetState,
} from '../../services/store/actions/invoices/sendToCollection';
import {
  archiveInvoice,
  archiveInvoiceResetState,
} from '../../services/store/actions/invoices/archiveInvoice';
import {
  sendInvoiceReminder,
  sendInvoiceReminderResetState,
} from '../../services/store/actions/invoices/sendInvoiceReminder';
import {
  sendCreditNote,
  sendCreditNoteResetState,
} from '../../services/store/actions/invoices/sendCreditNote';
import {fetchReceivedInvoices} from '../../services/store/actions/invoices/fetchReceivedInvoices';
import {
  markReceivedAsPaid,
  markReceivedAsPaidResetState,
} from '../../services/store/actions/invoices/markReceivedAsPaid';
import {
  archiveReceivedInvoice,
  archiveReceivedInvoiceResetState,
} from '../../services/store/actions/invoices/archiveReceivedInvoice';
import {setInvoicesState} from '../../services/store/actions/invoices/invoiceActions';

import {formatDateYYYYMMDD} from '../../utilities/date';
import Translations from '../../services/localization/Translations';

import {successAnimation} from '../../constants/Animations';
import RequestStates from '../../constants/States/RequestStates';
import Colors from '../../constants/Colors';
import System from '../../constants/System';
import Styles from '../../constants/Styles';
import {INVOICE_DIRECTIONS, INVOICE_TYPES} from '../../constants/Types/InvoiceTypes';
import {SUBSCRIPTION_FEATURES} from '../../constants/Params/SubscriptionParams';

import InvoicesList from '../../components/Lists/InvoicesList';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import Loading from '../../components/Indicators/Loading';
import ListingHeaderButtons from '../../components/Buttons/HeaderButtons/ListingHeaderButtons';
import SearchInput from '../../components/Inputs/SearchInput';
import HeaderRightCloseButton from '../../components/Buttons/HeaderButtons/HeaderRightCloseButton';
import FloatingLoading from '../../components/Indicators/FloatingLoading';
import MarkAsPaid from '../../components/Modals/MarkAsPaid';
import InvoiceStates from '../../constants/States/InvoiceStates';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import EntypoIcon from '../../components/Icons/EntypoIcon';
import FeatherIcon from '../../components/Icons/FeatherIcon';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import MaterialCommunityIcon from '../../components/Icons/MaterialCommunityIcon';
import ReceivedInvoicesList from '../../components/Lists/ReceivedInvoicesList';
import HeaderMenuButton from '../../components/Buttons/HeaderButtons/HeaderMenuButton';

export default function InvoicesScreen({navigation}) {
  const parentNavigator = navigation.dangerouslyGetParent();

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const invoiceActionsState = useSelector((store) => store.invoiceActions);
  const outgoingInvoices = useSelector((store) => store.fetchInvoices);
  const receivedInvoices = useSelector((store) => store.fetchReceivedInvoices);
  const createInvoiceState = useSelector((store) => store.createInvoice);
  const editInvoiceState = useSelector((store) => store.editInvoice);
  const sendInvoiceState = useSelector((store) => store.sendInvoice);
  const markAsPaidState = useSelector((store) => store.markAsPaid);
  const deleteInvoiceState = useSelector((store) => store.deleteInvoice);
  const sendToCollectionState = useSelector((store) => store.sendToCollection);
  const archiveInvoiceState = useSelector((store) => store.archiveInvoice);
  const sendReminderState = useSelector((store) => store.sendInvoiceReminder);
  const sendCreditNoteState = useSelector((store) => store.sendCreditNote);
  const markReceivedAsPaidState = useSelector((store) => store.markReceivedAsPaid);
  const archiveReceivedInvoiceState = useSelector((store) => store.archiveReceivedInvoice);

  const successToast = useSelector((store) => store.showToast.successToast);

  const {showActionSheetWithOptions} = useActionSheet();

  const [searchKeyword, setSearchKeyword] = useState(null);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMarkAsPaidVisible, setMarkAsPaidVisible] = useState(false);
  const [paidDate, setPaidDate] = useState(new Date());

  const loadData = useCallback(
    (isRefreshing) => {
      switch (invoiceActionsState.invoicesDirection) {
        case INVOICE_DIRECTIONS.OUTGOING:
          return dispatch(fetchInvoices(account.token, isRefreshing));
        case INVOICE_DIRECTIONS.RECEIVED:
          return dispatch(fetchReceivedInvoices(account.token, isRefreshing));
        default:
          return;
      }
    },
    [account.token, dispatch, invoiceActionsState.invoicesDirection],
  );

  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const createInvoice = useCallback(() => {
    navigation.navigate('CreateInvoice');
  }, [navigation]);

  const resetMarkAsPaid = useCallback(() => {
    setMarkAsPaidVisible(false);
    setPaidDate(new Date());
  }, []);

  useEffect(() => {
    switch (invoiceActionsState.invoicesDirection) {
      case INVOICE_DIRECTIONS.OUTGOING:
        if (!outgoingInvoices.state) {
          loadData();
        }
        break;
      case INVOICE_DIRECTIONS.RECEIVED:
        if (!receivedInvoices.state) {
          loadData();
        }
        break;
      default:
        break;
    }
  }, [
    invoiceActionsState.invoicesDirection,
    outgoingInvoices.state,
    receivedInvoices.state,
    loadData,
  ]);

  useEffect(() => {
    if (
      createInvoiceState.state === RequestStates.SUCCESS ||
      createInvoiceState.state === RequestStates.SEND_SUCCESS
    ) {
      refresh();
    }
  }, [createInvoiceState.state, refresh]);

  useEffect(() => {
    if (
      editInvoiceState.state === RequestStates.SUCCESS ||
      editInvoiceState.state === RequestStates.SEND_SUCCESS
    ) {
      refresh();
    }
  }, [editInvoiceState.state, refresh]);

  const changeInvoicesDirection = useCallback(() => {
    switch (invoiceActionsState.invoicesDirection) {
      case INVOICE_DIRECTIONS.RECEIVED:
        return dispatch(
          setInvoicesState({
            ...invoiceActionsState,
            invoicesDirection: INVOICE_DIRECTIONS.OUTGOING,
          }),
        );
      case INVOICE_DIRECTIONS.OUTGOING:
        return dispatch(
          setInvoicesState({
            ...invoiceActionsState,
            invoicesDirection: INVOICE_DIRECTIONS.RECEIVED,
          }),
        );
      default:
        return;
    }
  }, [dispatch, invoiceActionsState]);

  const setNavParams = useCallback(() => {
    if (parentNavigator) {
      const hasReceivedInvoicesFeature = accountDetails.subscription.plan.features.some(
        ({code}) => code === SUBSCRIPTION_FEATURES.E_INVOICES,
      );
      if (hasReceivedInvoicesFeature) {
        let headerTitle = {
          title: null,
          icon: null,
        };
        switch (invoiceActionsState.invoicesDirection) {
          case INVOICE_DIRECTIONS.RECEIVED:
            headerTitle = {
              title: Translations.RECEIVED_INVOICES,
              icon: <EntypoIcon name="chevron-down" color={Colors.white} size={26} />,
            };
            break;
          case INVOICE_DIRECTIONS.OUTGOING:
            headerTitle = {
              title: Translations.OUTGOING_INVOICES,
              icon: <EntypoIcon name="chevron-up" color={Colors.white} size={26} />,
            };
            break;
          default:
            return;
        }
        parentNavigator.setOptions({
          headerLeft: () => <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />,
          headerTitle: () => (
            <Button
              title={headerTitle.title}
              onPress={changeInvoicesDirection}
              containerStyle={styles.invoiceTypeButtonContainer}
              titleStyle={styles.invoiceTypeButtonTitle}
              icon={headerTitle.icon}
            />
          ),
          headerTitleAlign: 'center',
          headerRight: () => (
            <ListingHeaderButtons onCreate={createInvoice} onSearch={openSearch} />
          ),
        });
      } else {
        parentNavigator.setOptions({
          headerLeft: () => <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />,
          headerTitle: Translations.INVOICES,
          headerRight: () => (
            <ListingHeaderButtons onCreate={createInvoice} onSearch={openSearch} />
          ),
        });
      }
    }
  }, [
    parentNavigator,
    accountDetails.subscription.plan.features,
    invoiceActionsState.invoicesDirection,
    navigation,
    changeInvoicesDirection,
    createInvoice,
    openSearch,
  ]);

  const openSearch = useCallback(() => {
    if (parentNavigator) {
      setIsSearchVisible(true);
      parentNavigator.setOptions({
        headerLeft: null,
        headerTitle: () => <SearchInput onEdit={setSearchKeyword} />,
        headerRight: () => <HeaderRightCloseButton onPress={resetSearch} />,
      });
    }
  }, [parentNavigator, resetSearch]);

  const resetSearch = useCallback(() => {
    setSearchKeyword(null);
    setIsSearchVisible(false);
    setNavParams();
  }, [setNavParams]);

  const backButtonHandler = useCallback(() => {
    if (isSearchVisible) {
      resetSearch();
      return true;
    } else {
      return false;
    }
  }, [isSearchVisible, resetSearch]);

  useFocusEffect(() => {
    if (System.os === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }
  }, [backButtonHandler]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      setNavParams();
    });
  }, [navigation, setNavParams]);

  useEffect(() => {
    setNavParams();
  }, [setNavParams, invoiceActionsState.invoicesDirection]);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      if (parentNavigator) {
        parentNavigator.setOptions({
          headerTitle: null,
          headerRight: null,
        });
      }
    });
  }, [parentNavigator, navigation]);

  useEffect(() => {
    if (sendInvoiceState.state === RequestStates.SEND_SUCCESS) {
      dispatch(sendInvoiceResetState());
      refresh();
      return successToast.show(Translations.SEND_INVOICE_SUCCESS, successAnimation);
    }
  }, [sendInvoiceState.state, dispatch, refresh, successToast]);

  useEffect(() => {
    if (sendReminderState.state === RequestStates.SEND_SUCCESS) {
      dispatch(sendInvoiceReminderResetState());
      refresh();
      return successToast.show(Translations.SEND_REMINDER_SUCCESS, successAnimation);
    }
  }, [sendReminderState.state, successToast, dispatch, refresh]);

  useEffect(() => {
    if (sendCreditNoteState.state === RequestStates.SEND_SUCCESS) {
      dispatch(sendCreditNoteResetState());
      refresh();
      return successToast.show(Translations.SEND_CREDIT_NOTE_SUCCESS, successAnimation);
    }
  }, [sendCreditNoteState.state, refresh, dispatch, successToast]);

  useEffect(() => {
    if (markAsPaidState.state === RequestStates.SUCCESS) {
      resetMarkAsPaid();
      dispatch(markAsPaidResetState());
      refresh();
      return successToast.show(Translations.MARK_AS_PAID_SUCCESS, successAnimation);
    }
  }, [markAsPaidState.state, dispatch, refresh, successToast, resetMarkAsPaid]);

  useEffect(() => {
    if (sendToCollectionState.state === RequestStates.SUCCESS) {
      dispatch(sendToCollectionResetState());
      refresh();
      return successToast.show(Translations.SEND_TO_COLLECTION_SUCCESS, successAnimation);
    }
  }, [sendToCollectionState.state, successToast, dispatch, refresh]);

  useEffect(() => {
    if (archiveInvoiceState.state === RequestStates.SUCCESS) {
      dispatch(archiveInvoiceResetState());
      refresh();
      return successToast.show(Translations.ARCHIVE_INVOICE_SUCCESS, successAnimation);
    }
  }, [archiveInvoiceState.state, successToast, dispatch, refresh]);

  useEffect(() => {
    if (deleteInvoiceState.state === RequestStates.SUCCESS) {
      dispatch(deleteInvoiceResetState());
      refresh();
      return successToast.show(Translations.DELETE_INVOICE_SUCCESS, successAnimation);
    }
  }, [deleteInvoiceState.state, dispatch, refresh, successToast]);

  useEffect(() => {
    if (markReceivedAsPaidState.state === RequestStates.SUCCESS) {
      resetMarkAsPaid();
      dispatch(markReceivedAsPaidResetState());
      refresh();
      return successToast.show(Translations.MARK_AS_PAID_SUCCESS, successAnimation);
    }
  }, [dispatch, markReceivedAsPaidState.state, refresh, resetMarkAsPaid, successToast]);

  useEffect(() => {
    if (archiveReceivedInvoiceState.state === RequestStates.SUCCESS) {
      dispatch(archiveReceivedInvoiceResetState());
      refresh();
      return successToast.show(Translations.ARCHIVE_INVOICE_SUCCESS, successAnimation);
    }
  }, [archiveReceivedInvoiceState.state, dispatch, refresh, successToast]);

  const onMarkAsPaid = () => {
    const data = {
      paid_date: formatDateYYYYMMDD(paidDate),
      target_invoice_type: 'original',
    };
    dispatch(markAsPaid(selectedInvoice.id, account.token, data));
  };

  const onSend = (data) => {
    dispatch(sendInvoice(data.id, account.token, data));
  };

  const onSendReminder = (data) => {
    dispatch(sendInvoiceReminder(data.id, account.token, data));
  };

  const onSendCreditNote = (data) => {
    dispatch(sendCreditNote(data.id, account.token, data));
  };

  const onSendToCollection = (invoiceId) => {
    Alert.alert(Translations.SEND_TO_COLLECTION, `${Translations.SEND_TO_COLLECTION_CONFIRM}?`, [
      {
        text: Translations.CANCEL,
        cancelable: true,
        style: 'cancel',
      },
      {
        text: Translations.OK,
        onPress: () => dispatch(sendToCollection(invoiceId, account.token)),
        style: 'default',
      },
    ]);
  };

  const onArchive = (invoiceId) => {
    dispatch(archiveInvoice(invoiceId, account.token));
  };

  const onDelete = (invoiceId) => {
    Alert.alert(Translations.DELETE_INVOICE, `${Translations.DELETE_INVOICE_CONFIRM}?`, [
      {
        text: Translations.CANCEL,
        cancelable: true,
        style: 'cancel',
      },
      {
        text: Translations.OK,
        onPress: () => dispatch(deleteInvoice(invoiceId, account.token)),
        style: 'destructive',
      },
    ]);
  };

  const onMarkReceivedAsPaid = () => {
    const data = {
      paid_date: formatDateYYYYMMDD(paidDate),
    };
    dispatch(markReceivedAsPaid(selectedInvoice.id, account.token, data));
  };

  const onArchiveReceived = (invoiceId) => {
    dispatch(archiveReceivedInvoice(invoiceId, account.token));
  };

  const getInvoiceTitle = ({customer, invoice_number}) => {
    let title = customer.name;
    if (invoice_number) {
      title = `${invoice_number} | `.concat(customer.name);
    }
    return title;
  };

  const getReceivedInvoiceTitle = ({name, invoice_number}) => {
    let title = name;
    if (invoice_number) {
      title = `${invoice_number} | `.concat(name);
    }
    return title;
  };

  const getAvailableOptions = ({state, sub_state, due_date, reminder_sent_at, type, credited}) => {
    let options = {
      values: [],
      icons: [],
    };
    const isOverdue = new Date(due_date) < new Date();
    switch (sub_state) {
      case InvoiceStates.DRAFT:
        options = {
          values: [Translations.EDIT, Translations.SEND, Translations.DELETE],
          icons: [
            <EntypoIcon name="edit" />,
            <FeatherIcon name="send" />,
            <AntDesignIcon name="delete" />,
          ],
        };
        break;
      case InvoiceStates.CREATED:
        options = {
          values: [Translations.MARK_AS_PAID],
          icons: [<MaterialIcon name="attach-money" />],
        };
        break;
      case InvoiceStates.SENT:
        options = {
          values: [Translations.MARK_AS_PAID],
          icons: [<MaterialIcon name="attach-money" />],
        };
        break;
      case InvoiceStates.OVERDUE:
        options = {
          values: [Translations.MARK_AS_PAID],
          icons: [<MaterialIcon name="attach-money" />],
        };
        break;
      case InvoiceStates.REMINDED:
        options = {
          values: [Translations.MARK_AS_PAID],
          icons: [<MaterialIcon name="attach-money" />],
        };
        break;
      case InvoiceStates.COLLECTION:
        options = {
          values: [Translations.MARK_AS_PAID],
          icons: [<MaterialIcon name="attach-money" />],
        };
        break;
      case InvoiceStates.PAID:
        options = {
          values: [Translations.ARCHIVE],
          icons: [<EntypoIcon name="archive" />],
        };
        break;
      default:
        break;
    }
    switch (state) {
      case InvoiceStates.CREATED:
      case InvoiceStates.SENT:
        if (type === INVOICE_TYPES.INVOICE) {
          if (isOverdue) {
            if (!reminder_sent_at) {
              options.values.push(Translations.SEND_REMINDER);
              options.icons.push(<MaterialCommunityIcon name="bell-ring" />);
            }
            options.values.push(Translations.SEND_TO_COLLECTION);
            options.icons.push(<MaterialCommunityIcon name="file-replace-outline" />);
          }
        }
        if (type === INVOICE_TYPES.INVOICE || INVOICE_TYPES.INVOICE_REMINDER) {
          if (credited === 0) {
            options.values.push(Translations.SEND_CREDIT_NOTE);
            options.icons.push(<MaterialIcon name="attach-money" />);
          }
        }
        break;
      default:
        break;
    }
    return {
      values: [Translations.VIEW].concat(options.values, Translations.CANCEL),
      icons: [<AntDesignIcon name="eyeo" />].concat(options.icons, <MaterialIcon name="cancel" />),
    };
  };

  const getReceivedInvoiceAvailableOptions = ({state}) => {
    let options = {
      values: [],
      icons: [],
    };
    switch (state) {
      case InvoiceStates.OPEN:
        options = {
          values: [Translations.MARK_AS_PAID],
          icons: [<MaterialIcon name="attach-money" />],
        };
        break;
      case InvoiceStates.PAID:
        options = {
          values: [Translations.ARCHIVE],
          icons: [<EntypoIcon name="archive" />],
        };
        break;
      default:
        break;
    }
    return {
      values: [Translations.VIEW].concat(options.values, Translations.CANCEL),
      icons: [<AntDesignIcon name="eyeo" />].concat(options.icons, <MaterialIcon name="cancel" />),
    };
  };

  const showOptions = (invoice) => {
    setSelectedInvoice(invoice);
    const {id} = invoice;
    const title = getInvoiceTitle(invoice);
    const options = getAvailableOptions(invoice);
    const destructiveButtonIndex = options.values.indexOf(Translations.DELETE);
    const cancelButtonIndex = options.values.indexOf(Translations.CANCEL);
    showActionSheetWithOptions(
      {
        title,
        options: options.values,
        cancelButtonIndex,
        destructiveButtonIndex,
        tintColor: Colors.tintColor,
        icons: options.icons,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case options.values.indexOf(Translations.VIEW):
            return navigation.navigate('ViewInvoice', {invoice});
          case options.values.indexOf(Translations.EDIT):
            return navigation.navigate('EditInvoice', {invoice});
          case options.values.indexOf(Translations.SEND):
            return navigation.navigate('SendInvoice', {
              invoice,
              invoiceType: INVOICE_TYPES.INVOICE,
              onSendInvoice: onSend,
            });
          case options.values.indexOf(Translations.SEND_REMINDER):
            return navigation.navigate('SendInvoice', {
              invoice,
              invoiceType: INVOICE_TYPES.INVOICE_REMINDER,
              onSendInvoice: onSendReminder,
            });
          case options.values.indexOf(Translations.SEND_CREDIT_NOTE):
            return navigation.navigate('SendInvoice', {
              invoice,
              invoiceType: INVOICE_TYPES.CREDIT_NOTE,
              onSendInvoice: onSendCreditNote,
            });
          case options.values.indexOf(Translations.MARK_AS_PAID):
            return setMarkAsPaidVisible(true);
          case options.values.indexOf(Translations.SEND_TO_COLLECTION):
            return onSendToCollection(id);
          case options.values.indexOf(Translations.ARCHIVE):
            return onArchive(id);
          case options.values.indexOf(Translations.DELETE):
            return onDelete(id);
          default:
            return;
        }
      },
    );
  };

  const showReceivedInvoicesOptions = (invoice) => {
    setSelectedInvoice(invoice);
    const {id} = invoice;
    const title = getReceivedInvoiceTitle(invoice);
    const options = getReceivedInvoiceAvailableOptions(invoice);
    const cancelButtonIndex = options.values.indexOf(Translations.CANCEL);
    showActionSheetWithOptions(
      {
        title,
        options: options.values,
        cancelButtonIndex,
        tintColor: Colors.tintColor,
        icons: options.icons,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case options.values.indexOf(Translations.VIEW):
            return navigation.navigate('ViewReceivedInvoice', {invoice});
          case options.values.indexOf(Translations.MARK_AS_PAID):
            return setMarkAsPaidVisible(true);
          case options.values.indexOf(Translations.ARCHIVE):
            return onArchiveReceived(id);
          default:
            return;
        }
      },
    );
  };

  const isLoading = () => {
    return (
      deleteInvoiceState.state === RequestStates.LOADING ||
      sendToCollectionState.state === RequestStates.LOADING ||
      archiveInvoiceState.state === RequestStates.LOADING
    );
  };

  const renderOutgoingInvoices = () => {
    switch (outgoingInvoices.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_INVOICES} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_INVOICES_FAILED}
            onPressButton={() => loadData()}
          />
        );
      case RequestStates.REFRESHING:
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <InvoicesList
              invoices={outgoingInvoices.invoices}
              searchKeyword={searchKeyword}
              onRefresh={refresh}
              isRefreshing={outgoingInvoices.state === RequestStates.REFRESHING}
              onPressInvoice={showOptions}
              onCreate={createInvoice}
            />
            <MarkAsPaid
              isVisible={isMarkAsPaidVisible}
              isLoading={markAsPaidState.state === RequestStates.LOADING}
              onCancel={resetMarkAsPaid}
              onConfirm={onMarkAsPaid}
              date={paidDate}
              error={markAsPaidState.error}
              onChangeDate={setPaidDate}
              minDate={selectedInvoice && new Date(selectedInvoice.invoice_date)}
              maxDate={new Date()}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const renderReceivedInvoices = () => {
    switch (receivedInvoices.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_INVOICES} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_INVOICES_FAILED}
            onPressButton={() => loadData()}
          />
        );
      case RequestStates.REFRESHING:
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            {isLoading() && <FloatingLoading />}
            <ReceivedInvoicesList
              invoices={receivedInvoices.invoices}
              searchKeyword={searchKeyword}
              onRefresh={refresh}
              isRefreshing={receivedInvoices.state === RequestStates.REFRESHING}
              onPressInvoice={showReceivedInvoicesOptions}
            />
            <MarkAsPaid
              isVisible={isMarkAsPaidVisible}
              isLoading={markReceivedAsPaidState.state === RequestStates.LOADING}
              onCancel={resetMarkAsPaid}
              onConfirm={onMarkReceivedAsPaid}
              date={paidDate}
              error={markReceivedAsPaidState.error}
              onChangeDate={setPaidDate}
              minDate={selectedInvoice && new Date(selectedInvoice.invoice_date)}
              maxDate={new Date()}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (invoiceActionsState.invoicesDirection) {
      case INVOICE_DIRECTIONS.OUTGOING:
        return renderOutgoingInvoices();
      case INVOICE_DIRECTIONS.RECEIVED:
        return renderReceivedInvoices();
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
  invoiceTypeButtonContainer: {
    marginRight: 32.5,
  },
  invoiceTypeButtonTitle: {
    fontSize: Styles.headerFontSize - 1,
    marginLeft: 6,
  },
});
