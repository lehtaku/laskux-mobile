import React from 'react';

import {LogBox, StatusBar, StyleSheet, View} from 'react-native';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from 'react-native-elements';

import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {errorCatcher} from './services/store/middlewares/authMiddleware';
import {clearStates} from './services/store/middlewares/logoutMiddleware';

import Theme from './constants/Theme';
import Colors from './constants/Colors';

import {LocalizationProvider} from './services/localization/LocalizationContext';
import AppNavigator from './navigation/AppNavigator';

import fetchAppVersionReducer from './services/store/reducers/tools/fetchAppVersion';
import loginReducer from './services/store/reducers/authentication/login';
import fetchAccountReducer from './services/store/reducers/authentication/fetchAccount';
import setAccountReducer from './services/store/reducers/authentication/setAccount';
import fetchAccountsReducer from './services/store/reducers/authentication/fetchAccounts';
import filterCustomersReducer from './services/store/reducers/customers/filterCustomers';
import fetchItemsReducer from './services/store/reducers/items/fetchItems';
import editInvoiceReducer from './services/store/reducers/invoices/editInvoice';
import createItemReducer from './services/store/reducers/items/createItem';
import fetchCustomersReducer from './services/store/reducers/customers/fetchCustomers';
import filterItemsReducer from './services/store/reducers/items/filterItems';
import deleteItemReducer from './services/store/reducers/items/deleteItem';
import deleteInvoiceReducer from './services/store/reducers/invoices/deleteInvoice';
import fetchInvoiceReducer from './services/store/reducers/invoices/fetchInvoice';
import editItemReducer from './services/store/reducers/items/editItem';
import createCustomerReducer from './services/store/reducers/customers/createCustomer';
import editCustomerReducer from './services/store/reducers/customers/editCustomer';
import deleteCustomerReducer from './services/store/reducers/customers/deleteCustomer';
import fetchInvoicesReducer from './services/store/reducers/invoices/fetchInvoices';
import fetchPenaltyInterestsReducer from './services/store/reducers/invoices/fetchPenaltyInterests';
import fetchItemUnitsReducer from './services/store/reducers/items/fetchItemUnits';
import createInvoiceReducer from './services/store/reducers/invoices/createInvoice';
import sendInvoiceReducer from './services/store/reducers/invoices/sendInvoice';
import markAsPaidReducer from './services/store/reducers/invoices/markAsPaid';
import fetchLogoReducer from './services/store/reducers/account/fetchLogo';
import fetchGroupsReducer from './services/store/reducers/customers/fetchGroups';
import fetchCategoriesReducer from './services/store/reducers/items/fetchCategories';
import salesByMonthReducer from './services/store/reducers/reports/salesByMonth';
import salesByCustomerReducer from './services/store/reducers/reports/salesByCustomer';
import salesByItemReducer from './services/store/reducers/reports/salesByItem';
import salesReportReducer from './services/store/reducers/reports/salesReport';
import viewInvoiceReducer from './services/store/reducers/invoices/viewInvoice';
import fetchAccountDetailsReducer from './services/store/reducers/account/fetchAccountDetails';
import fetchItemReducer from './services/store/reducers/items/fetchItem';
import fetchCustomerReducer from './services/store/reducers/customers/fetchCustomer';
import showToastReducer from './services/store/reducers/toasts/showToast';
import sendToCollectionReducer from './services/store/reducers/invoices/sendToCollection';
import archiveInvoiceReducer from './services/store/reducers/invoices/archiveInvoice';
import fetchEmailTemplatesReducer from './services/store/reducers/invoices/fetchEmailTemplates';
import fetchPersonalDetailsReducer from './services/store/reducers/account/fetchPersonalDetails';
import updatePersonalDetailsReducer from './services/store/reducers/account/updatePersonalDetails';
import updateAccountDetailsReducer from './services/store/reducers/account/updateAccountDetails';
import invoiceActionsReducer from './services/store/reducers/invoices/invoiceActions';
import errorValidationReducer from './services/store/reducers/authentication/errorValidation';
import logoutReducer from './services/store/reducers/authentication/logout';
import sendEmailReducer from './services/store/reducers/service/sendEmail';
import fetchServiceSettingsReducer from './services/store/reducers/service/fetchServiceSettings';
import updateServiceSettingsReducer from './services/store/reducers/service/updateServiceSettings';
import addCustomerNoteReducer from './services/store/reducers/customers/addNote';
import deleteCustomerNoteReducer from './services/store/reducers/customers/deleteNote';
import addInvoiceNoteReducer from './services/store/reducers/invoices/addNote';
import deleteInvoiceNoteReducer from './services/store/reducers/invoices/deleteNote';
import sendInvoiceReminderReducer from './services/store/reducers/invoices/sendInvoiceReminder';
import fetchAttachmentsReducer from './services/store/reducers/attachments/fetchAttachments';
import fetchOperatorsReducer from './services/store/reducers/tools/fetchOperators';
import sendCreditNoteReducer from './services/store/reducers/invoices/sendCreditNote';
import resetPasswordReducer from './services/store/reducers/authentication/resetPassword';
import registerReducer from './services/store/reducers/authentication/register';
import searchCompanyByNameReducer from './services/store/reducers/tools/searchCompanyByName';
import searchCompanyByIdReducer from './services/store/reducers/tools/searchCompanyById';
import fetchBanksReducer from './services/store/reducers/tools/fetchBanks';
import fetchNewsReducer from './services/store/reducers/tools/fetchNews';
import hideNewsReducer from './services/store/reducers/tools/hideNews';
import fetchReceivedInvoicesReducer from './services/store/reducers/invoices/fetchReceivedInvoices';
import viewReceivedInvoiceReducer from './services/store/reducers/invoices/viewReceivedInvoice';
import markReceivedAsPaidReducer from './services/store/reducers/invoices/markReceivedAsPaid';
import archiveReceivedInvoiceReducer from './services/store/reducers/invoices/archiveReceivedInvoice';
import fetchSingleAttachmentReducer from './services/store/reducers/invoices/fetchSingleAttachment';
import fetchReceiptsReducer from './services/store/reducers/receipts/fetchReceipts';
import receiptActionsReducer from './services/store/reducers/receipts/receiptActions';
import addReceiptReducer from './services/store/reducers/receipts/addReceipt';
import deleteReceiptReducer from './services/store/reducers/receipts/deleteReceipt';
import completeReceiptReducer from './services/store/reducers/receipts/completeReceipt';
import fetchReceiptReducer from './services/store/reducers/receipts/fetchReceipt';
import fetchReceiptAttachmentsReducer from './services/store/reducers/receipts/fetchReceiptAttachments';
import editReceiptReducer from './services/store/reducers/receipts/editReceipt';
import fetchOffersReducer from './services/store/reducers/offers/fetchOffers';
import offerActionsReducer from './services/store/reducers/offers/offerActions';
import createOfferReducer from './services/store/reducers/offers/createOffer';
import editOfferReducer from './services/store/reducers/offers/editOffer';
import sendOfferReducer from './services/store/reducers/offers/sendOffer';
import deleteOfferReducer from './services/store/reducers/offers/deleteOffer';
import markOfferAsApprovedReducer from './services/store/reducers/offers/markOfferAsApproved';
import fetchOfferReducer from './services/store/reducers/offers/fetchOffer';
import viewOfferReducer from './services/store/reducers/offers/viewOffer';
import fetchSellersReducer from './services/store/reducers/sellers/fetchSellers';

const rootReducer = combineReducers({
  fetchAppVersion: fetchAppVersionReducer,
  login: loginReducer,
  logout: logoutReducer,
  fetchAccount: fetchAccountReducer,
  fetchAccountDetails: fetchAccountDetailsReducer,
  setAccount: setAccountReducer,
  fetchInvoices: fetchInvoicesReducer,
  fetchAccounts: fetchAccountsReducer,
  fetchInvoice: fetchInvoiceReducer,
  fetchReceivedInvoices: fetchReceivedInvoicesReducer,
  fetchItem: fetchItemReducer,
  fetchItemUnits: fetchItemUnitsReducer,
  sendInvoice: sendInvoiceReducer,
  fetchPenaltyInterests: fetchPenaltyInterestsReducer,
  deleteInvoice: deleteInvoiceReducer,
  markAsPaid: markAsPaidReducer,
  fetchCategories: fetchCategoriesReducer,
  salesByMonth: salesByMonthReducer,
  salesByCustomer: salesByCustomerReducer,
  salesByItem: salesByItemReducer,
  salesReport: salesReportReducer,
  fetchLogo: fetchLogoReducer,
  fetchGroups: fetchGroupsReducer,
  createInvoice: createInvoiceReducer,
  filterCustomers: filterCustomersReducer,
  fetchCustomers: fetchCustomersReducer,
  editInvoice: editInvoiceReducer,
  createCustomer: createCustomerReducer,
  editCustomer: editCustomerReducer,
  fetchItems: fetchItemsReducer,
  deleteCustomer: deleteCustomerReducer,
  filterItems: filterItemsReducer,
  viewInvoice: viewInvoiceReducer,
  createItem: createItemReducer,
  editItem: editItemReducer,
  deleteItem: deleteItemReducer,
  showToast: showToastReducer,
  fetchCustomer: fetchCustomerReducer,
  sendToCollection: sendToCollectionReducer,
  archiveInvoice: archiveInvoiceReducer,
  fetchEmailTemplates: fetchEmailTemplatesReducer,
  fetchPersonalDetails: fetchPersonalDetailsReducer,
  updatePersonalDetails: updatePersonalDetailsReducer,
  updateAccountDetails: updateAccountDetailsReducer,
  invoiceActions: invoiceActionsReducer,
  errorValidation: errorValidationReducer,
  sendEmail: sendEmailReducer,
  fetchServiceSettings: fetchServiceSettingsReducer,
  updateServiceSettings: updateServiceSettingsReducer,
  addInvoiceNote: addInvoiceNoteReducer,
  deleteInvoiceNote: deleteInvoiceNoteReducer,
  addCustomerNote: addCustomerNoteReducer,
  deleteCustomerNote: deleteCustomerNoteReducer,
  sendInvoiceReminder: sendInvoiceReminderReducer,
  fetchAttachments: fetchAttachmentsReducer,
  fetchOperators: fetchOperatorsReducer,
  sendCreditNote: sendCreditNoteReducer,
  resetPassword: resetPasswordReducer,
  registerAccount: registerReducer,
  searchCompanyByName: searchCompanyByNameReducer,
  searchCompanyById: searchCompanyByIdReducer,
  fetchBanks: fetchBanksReducer,
  fetchNews: fetchNewsReducer,
  hideNews: hideNewsReducer,
  viewReceivedInvoice: viewReceivedInvoiceReducer,
  markReceivedAsPaid: markReceivedAsPaidReducer,
  archiveReceivedInvoice: archiveReceivedInvoiceReducer,
  fetchSingleAttachment: fetchSingleAttachmentReducer,
  fetchReceipts: fetchReceiptsReducer,
  receiptActions: receiptActionsReducer,
  addReceipt: addReceiptReducer,
  deleteReceipt: deleteReceiptReducer,
  completeReceipt: completeReceiptReducer,
  fetchReceipt: fetchReceiptReducer,
  fetchReceiptAttachments: fetchReceiptAttachmentsReducer,
  editReceipt: editReceiptReducer,
  fetchOffers: fetchOffersReducer,
  offerActions: offerActionsReducer,
  createOffer: createOfferReducer,
  editOffer: editOfferReducer,
  sendOffer: sendOfferReducer,
  deleteOffer: deleteOfferReducer,
  markOfferAsApproved: markOfferAsApprovedReducer,
  fetchOffer: fetchOfferReducer,
  viewOffer: viewOfferReducer,
  fetchSellers: fetchSellersReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk, errorCatcher, clearStates));

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Non-serializable values were found in the navigation state.',
]);

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.tintColor} />
      <Provider store={store}>
        <LocalizationProvider>
          <SafeAreaProvider>
            <ThemeProvider theme={Theme}>
              <ActionSheetProvider>
                <AppNavigator />
              </ActionSheetProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </LocalizationProvider>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
