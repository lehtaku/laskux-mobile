import React from 'react';

import {StyleSheet, View} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import Translations from '../services/localization/Translations';
import {useSelector} from 'react-redux';

import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import System from '../constants/System';

import DrawerNavigatorIcon from '../components/Icons/DrawerNavigatorIcon';
import EntypoIcon from '../components/Icons/EntypoIcon';
import HeaderLeftCloseButton from '../components/Buttons/HeaderButtons/HeaderLeftCloseButton';
import MaterialIcon from '../components/Icons/MaterialIcon';

import InvoicesScreen from '../screens/Invoices/InvoicesScreen';
import CustomersScreen from '../screens/Customers/CustomersScreen';
import AccountScreen from '../screens/Account/AccountScreen';
import ItemsScreen from '../screens/Items/ItemsScreen';
import EditItemScreen from '../screens/Items/EditItemScreen';
import CreateItemScreen from '../screens/Items/CreateItemScreen';
import CreateCustomerScreen from '../screens/Customers/CreateCustomerScreen';
import EditCustomerScreen from '../screens/Customers/EditCustomerScreen';
import CreateInvoiceScreen from '../screens/Invoices/CreateInvoiceScreen';
import EditInvoiceScreen from '../screens/Invoices/EditInvoiceScreen';
import ChangeAccountScreen from '../screens/Account/ChangeAccountScreen';
import ViewInvoiceScreen from '../screens/Invoices/ViewInvoiceScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import PersonalDetailsScreen from '../screens/Account/PersonalDetailsScreen';
import AccountDetailsScreen from '../screens/Account/AccountDetailsScreen';
import SettingsScreen from '../screens/Service/SettingsScreen';
import CustomerServiceScreen from '../screens/Service/CustomerServiceScreen';
import SendNewInvoiceScreen from '../screens/Invoices/SendInvoiceScreen';
import SelectorScreen from '../screens/Service/SelectorScreen';
import SalesReportScreen from '../screens/Home/SalesReportScreen';
import SalesByCustomerScreen from '../screens/Home/SalesByCustomerScreen';
import SalesByItemScreen from '../screens/Home/SalesByItemScreen';
import SalesByMonthScreen from '../screens/Home/SalesByMonthScreen';
import ViewReceivedInvoiceScreen from '../screens/Invoices/ViewReceivedInvoiceScreen';
import ReceiptsScreen from '../screens/Receipts/ReceiptsScreen';
import CreateReceiptScreen from '../screens/Receipts/CreateReceiptScreen';
import ViewReceiptScreen from '../screens/Receipts/ViewReceiptScreen';
import EditReceiptScreen from '../screens/Receipts/EditReceiptScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import OffersScreen from '../screens/Offers/OffersScreen';
import MaterialCommunityIcon from '../components/Icons/MaterialCommunityIcon';
import CreateOfferScreen from '../screens/Offers/CreateOfferScreen';
import EditOfferScreen from '../screens/Offers/EditOfferScreen';
import SendOfferScreen from '../screens/Offers/SendOfferScreen';
import {SUBSCRIPTION_FEATURES} from '../constants/Params/SubscriptionParams';

export const getDefaultNavOptions = () => {
  let options = {
    cardStyle: {
      backgroundColor: Colors.screenBackground,
    },
    headerStyle: {
      backgroundColor: Colors.tintColor,
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    headerTitleStyle: {
      fontFamily: Styles.fontBold,
      fontSize: Styles.headerFontSize,
      fontWeight: '800',
    },
    headerTintColor: Colors.white,
    headerBackTitle: Translations.GO_BACK,
    headerBackTitleStyle: {
      fontFamily: Styles.fontRegular,
    },
  };
  if (System.os === 'android') {
    options = {...options, safeAreaInsets: {top: 0}};
  } else if (System.os === 'ios') {
    options = {
      ...options,
      headerBackImage: () => <EntypoIcon name="chevron-thin-left" color={Colors.white} />,
    };
  }
  return options;
};

export const getLeftCloseButton = () => {
  return {
    headerLeft: () => <HeaderLeftCloseButton />,
  };
};

const NavigatorIconWrapper = ({children}) => (
  <View style={styles.drawerIconWrapper}>{children}</View>
);

const Drawer = createDrawerNavigator();

function MainScreens() {
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const Screens = [
    {
      name: 'Home',
      component: HomeScreen,
      options: {
        drawerIcon: ({focused}) => (
          <NavigatorIconWrapper>
            <DrawerNavigatorIcon focused={focused} name="home" size={24} />
          </NavigatorIconWrapper>
        ),
        drawerLabel: Translations.HOME,
      },
    },
    {
      name: 'Invoices',
      component: InvoicesScreen,
      options: {
        drawerIcon: ({focused}) => (
          <NavigatorIconWrapper>
            <DrawerNavigatorIcon focused={focused} name="file1" size={22} />
          </NavigatorIconWrapper>
        ),
        drawerLabel: Translations.INVOICES,
      },
    },
    {
      name: 'Customers',
      component: CustomersScreen,
      options: {
        drawerIcon: ({focused}) => (
          <NavigatorIconWrapper>
            <DrawerNavigatorIcon focused={focused} name="team" size={24} />
          </NavigatorIconWrapper>
        ),
        drawerLabel: Translations.CUSTOMERS,
      },
    },
    {
      name: 'Items',
      component: ItemsScreen,
      options: {
        drawerIcon: ({focused}) => (
          <NavigatorIconWrapper>
            <DrawerNavigatorIcon focused={focused} name="tagso" size={27} />
          </NavigatorIconWrapper>
        ),
        drawerLabel: Translations.ITEMS,
      },
    },
    {
      name: 'Account',
      component: AccountScreen,
      options: {
        drawerIcon: ({focused}) => (
          <NavigatorIconWrapper>
            <DrawerNavigatorIcon focused={focused} name="user" size={24} />
          </NavigatorIconWrapper>
        ),
        drawerLabel: Translations.ACCOUNT,
      },
    },
  ];

  const haveReceiptsFeature = accountDetails.subscription.plan.features.some(
    (feature) => feature.code === SUBSCRIPTION_FEATURES.RECEIPTS,
  );
  const haveOffersFeature = accountDetails.subscription.plan.features.some(
    (feature) => feature.code === SUBSCRIPTION_FEATURES.OFFERS,
  );

  if (haveReceiptsFeature) {
    Screens.splice(2, 0, {
      name: 'Receipts',
      component: ReceiptsScreen,
      options: {
        drawerIcon: ({focused}) => (
          <NavigatorIconWrapper>
            <MaterialIcon
              name="receipt"
              size={24}
              color={focused ? Colors.tintColor : Colors.tabIconDefault}
            />
          </NavigatorIconWrapper>
        ),
        drawerLabel: Translations.RECEIPTS,
      },
    });
  }

  if (haveOffersFeature) {
    Screens.splice(5, 0, {
      name: 'Offers',
      component: OffersScreen,
      options: {
        drawerIcon: ({focused}) => (
          <NavigatorIconWrapper>
            <MaterialCommunityIcon
              name="file-percent"
              size={24}
              color={focused ? Colors.tintColor : Colors.tabIconDefault}
            />
          </NavigatorIconWrapper>
        ),
        drawerLabel: Translations.OFFERS,
      },
    });
  }

  const drawerContentOptions = {
    labelStyle: styles.drawerLabel,
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContentOptions={drawerContentOptions}
      drawerStyle={styles.drawer}
      screenOptions={getDefaultNavOptions()}>
      {Screens.map(({name, component, options}) => (
        <Drawer.Screen key={name} name={name} options={options} component={component} />
      ))}
    </Drawer.Navigator>
  );
}

const AppStack = createStackNavigator();

export default function DrawerNavigator() {
  return (
    <AppStack.Navigator initialRouteName="HomeTabs" screenOptions={getDefaultNavOptions()}>
      <AppStack.Screen name="HomeTabs" component={MainScreens} options={{title: null}} />
      <AppStack.Screen
        name="ShowReport"
        component={SalesReportScreen}
        options={{title: Translations.REPORT}}
      />
      <AppStack.Screen
        name="SalesReport"
        component={SalesReportScreen}
        options={{
          title: Translations.SALES_REPORT,
        }}
      />
      <AppStack.Screen
        name="SalesByCustomer"
        component={SalesByCustomerScreen}
        options={{
          title: Translations.SALES_BY_CUSTOMER,
        }}
      />
      <AppStack.Screen
        name="SalesByItem"
        component={SalesByItemScreen}
        options={{
          title: Translations.SALES_BY_ITEM,
        }}
      />
      <AppStack.Screen
        name="SalesByMonth"
        component={SalesByMonthScreen}
        options={{
          title: Translations.SALES_BY_MONTH,
        }}
      />
      <AppStack.Screen
        name="CreateInvoice"
        component={CreateInvoiceScreen}
        options={{
          title: Translations.CREATE_INVOICE,
          ...getLeftCloseButton(),
        }}
      />
      <AppStack.Screen
        name="EditInvoice"
        component={EditInvoiceScreen}
        options={{
          title: Translations.EDIT_INVOICE,
          ...getLeftCloseButton(),
        }}
      />
      <AppStack.Screen
        name="SendInvoice"
        component={SendNewInvoiceScreen}
        options={{
          title: Translations.SEND_INVOICE,
          ...getLeftCloseButton(),
        }}
      />
      <AppStack.Screen
        name="ViewInvoice"
        component={ViewInvoiceScreen}
        options={{
          title: Translations.VIEW_INVOICE,
        }}
      />
      <AppStack.Screen
        name="ViewReceivedInvoice"
        component={ViewReceivedInvoiceScreen}
        options={{
          title: Translations.VIEW_INVOICE,
        }}
      />
      <AppStack.Screen
        name="CreateCustomer"
        component={CreateCustomerScreen}
        options={{
          title: Translations.CREATE_CUSTOMER,
          ...getLeftCloseButton(),
        }}
      />
      <AppStack.Screen
        name="EditCustomer"
        component={EditCustomerScreen}
        options={{
          title: Translations.CUSTOMER_DETAILS,
          ...getLeftCloseButton(),
        }}
      />
      <AppStack.Screen
        name="CreateItem"
        component={CreateItemScreen}
        options={{
          title: Translations.CREATE_ITEM,
          ...getLeftCloseButton(),
        }}
      />
      <AppStack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{
          title: Translations.ITEM_DETAILS,
          ...getLeftCloseButton(),
        }}
      />
      <AppStack.Screen
        name="PersonalDetails"
        component={PersonalDetailsScreen}
        options={{
          title: Translations.PERSONAL_DETAILS,
        }}
      />
      <AppStack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
        options={{
          title: Translations.ACCOUNT_DETAILS,
        }}
      />
      <AppStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: Translations.SETTINGS,
        }}
      />
      <AppStack.Screen
        name="CustomerService"
        component={CustomerServiceScreen}
        options={{
          title: Translations.CUSTOMER_SERVICE,
        }}
      />
      <AppStack.Screen
        name="ChangeAccount"
        component={ChangeAccountScreen}
        options={{
          title: Translations.CHANGE_ACCOUNT,
        }}
      />
      <AppStack.Screen
        name="CreateReceipt"
        component={CreateReceiptScreen}
        options={{title: Translations.ADD_RECEIPT}}
      />
      <AppStack.Screen
        name="ViewReceipt"
        component={ViewReceiptScreen}
        options={{title: Translations.VIEW_RECEIPT}}
      />
      <AppStack.Screen
        name="EditReceipt"
        component={EditReceiptScreen}
        options={{title: Translations.EDIT_RECEIPT}}
      />
      <AppStack.Screen
        name="CreateOffer"
        component={CreateOfferScreen}
        options={{title: Translations.CREATE_OFFER}}
      />
      <AppStack.Screen
        name="EditOffer"
        component={EditOfferScreen}
        options={{title: Translations.EDIT_OFFER}}
      />
      <AppStack.Screen
        name="SendOffer"
        component={SendOfferScreen}
        options={{title: Translations.SEND_OFFER}}
      />
      <AppStack.Screen name="SelectorScreen" component={SelectorScreen} options={{title: null}} />
    </AppStack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {},
  drawerLabel: {
    fontFamily: Styles.fontRegular,
  },
  drawerIconWrapper: {
    width: 25,
  },
});
