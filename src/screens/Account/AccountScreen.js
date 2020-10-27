import React, {useCallback, useEffect} from 'react';

import {RefreshControl, ScrollView, StyleSheet, View, Linking} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import {logoutFromApiAndDevice} from '../../services/store/actions/authentication/logout';
import {fetchAccounts} from '../../services/store/actions/authentication/fetchAccounts';
import {fetchLogo} from '../../services/store/actions/account/fetchLogo';
import {fetchAccountDetails} from '../../services/store/actions/account/fetchAccountDetails';
import {fetchPersonalDetails} from '../../services/store/actions/account/fetchPersonalDetails';

import Translations from '../../services/localization/Translations';

import {dangerAnimation} from '../../constants/Animations';
import Colors from '../../constants/Colors';
import System from '../../constants/System';
import Styles from '../../constants/Styles';

import CustomListItem from '../../components/ListItems/CustomListItem';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import MaterialCommunityIcon from '../../components/Icons/MaterialCommunityIcon';
import RequestStates from '../../constants/States/RequestStates';
import TitleText from '../../components/Text/TitleText';
import Logo from '../../components/Layout/Logo';
import PrimaryText from '../../components/Text/PrimaryText';
import HeaderMenuButton from '../../components/Buttons/HeaderButtons/HeaderMenuButton';

export default function AccountScreen({navigation}) {
  const parentNavigator = navigation.dangerouslyGetParent();

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchAccountsState = useSelector((store) => store.fetchAccounts);
  const fetchLogoState = useSelector((store) => store.fetchLogo);
  const fetchPersonalDetailsState = useSelector((store) => store.fetchPersonalDetails);
  const updatePersonalDetailsState = useSelector((store) => store.updatePersonalDetails);
  const updateAccountDetailsState = useSelector((store) => store.updateAccountDetails);
  const updateServiceSettingState = useSelector((store) => store.updateServiceSettings);

  const dangerToast = useSelector((store) => store.showToast.dangerToast);

  const loadData = useCallback(
    (isRefreshing) => {
      dispatch(fetchAccountDetails(account.token, isRefreshing));
      dispatch(fetchPersonalDetails(account.token, isRefreshing));
      dispatch(fetchLogo(account.token, isRefreshing));
      dispatch(fetchAccounts());
    },
    [account.token, dispatch],
  );

  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (updatePersonalDetailsState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [refresh, updatePersonalDetailsState.state]);

  useEffect(() => {
    if (updateAccountDetailsState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [refresh, updateAccountDetailsState.state]);

  useEffect(() => {
    if (updateServiceSettingState.state === RequestStates.SUCCESS) {
      refresh();
    }
  }, [refresh, updateServiceSettingState.state]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (parentNavigator) {
        parentNavigator.setOptions({
          headerLeft: () => <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />,
          headerTitle: Translations.ACCOUNT,
        });
      }
    });
  }, [parentNavigator, navigation]);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      if (parentNavigator) {
        parentNavigator.setOptions({
          headerTitle: null,
        });
      }
    });
  }, [parentNavigator, navigation]);

  const changeAccount = () => {
    navigation.navigate('ChangeAccount', {accounts: fetchAccountsState.accounts});
  };

  const editPersonalDetails = () => {
    requestAnimationFrame(() => {
      navigation.navigate('PersonalDetails');
    });
  };

  const editAccountDetails = () => {
    requestAnimationFrame(() => {
      navigation.navigate('AccountDetails');
    });
  };

  const editSettings = () => {
    requestAnimationFrame(() => {
      navigation.navigate('Settings');
    });
  };

  const openCustomerService = () => {
    requestAnimationFrame(() => {
      navigation.navigate('CustomerService');
    });
  };

  const openTermsOfService = async () => {
    try {
      await Linking.openURL('https://www.laskux.fi/tietosuojaseloste');
    } catch (error) {
      dangerToast.show(Translations.OPENING_BROWSER_FAILED, dangerAnimation);
    }
  };

  const getLogoSource = () => {
    if (fetchLogoState.logoData) {
      return {uri: fetchLogoState.logoData};
    }
  };

  const isRefreshing = () => {
    return (
      accountDetails.state === RequestStates.REFRESHING ||
      fetchPersonalDetailsState.state === RequestStates.REFRESHING ||
      fetchLogoState.state === RequestStates.REFRESHING
    );
  };

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing()} onRefresh={refresh} />}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Logo source={getLogoSource()} />
        </View>
        <View style={styles.headerRight}>
          <TitleText text={accountDetails.details.name} style={styles.accountName} />
        </View>
      </View>

      <View style={styles.column}>
        {fetchAccountsState.accounts.length > 1 && (
          <CustomListItem
            onPress={changeAccount}
            leftIcon={<MaterialCommunityIcon name="account-switch" />}
            title={Translations.CHANGE_ACCOUNT}
            chevron
            topDivider
          />
        )}
        <CustomListItem
          onPress={editPersonalDetails}
          leftIcon={<MaterialCommunityIcon name="account" />}
          title={Translations.PERSONAL_DETAILS}
          chevron
          topDivider
          bottomDivider
        />
        <CustomListItem
          onPress={editAccountDetails}
          leftIcon={<MaterialCommunityIcon name="account-details" />}
          title={Translations.ACCOUNT_DETAILS}
          chevron
          bottomDivider
        />
        <CustomListItem
          onPress={editSettings}
          leftIcon={<AntDesignIcon name="setting" />}
          title={Translations.SETTINGS}
          chevron
          bottomDivider
        />
      </View>
      <View style={styles.column}>
        <CustomListItem
          title={Translations.CONTACT_US}
          leftIcon={<AntDesignIcon name="customerservice" />}
          onPress={openCustomerService}
          chevron
          topDivider
          bottomDivider
        />
        <CustomListItem
          title={Translations.TERMS_OF_SERVICE}
          leftIcon={<AntDesignIcon name="filetext1" />}
          onPress={openTermsOfService}
          chevron
          bottomDivider
        />
        <CustomListItem
          title={Translations.LOGOUT}
          leftIcon={<AntDesignIcon name="logout" />}
          onPress={() => dispatch(logoutFromApiAndDevice(account.token))}
          chevron
          bottomDivider
        />
      </View>
      <View style={styles.column}>
        <PrimaryText
          text={`${Translations.VERSION} ${System.appVersion}`}
          style={styles.versionText}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 1,
  },
  headerLeft: {
    paddingHorizontal: 16,
  },
  headerRight: {
    flex: 1,
    paddingHorizontal: 16,
  },
  accountName: {
    marginBottom: 0,
  },
  column: {
    marginTop: 24,
  },
  versionText: {
    alignSelf: 'center',
    fontSize: Styles.secondaryFontSize,
    marginBottom: 12,
  },
});
