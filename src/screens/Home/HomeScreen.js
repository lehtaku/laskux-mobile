import React, {useCallback, useContext, useEffect} from 'react';

import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

import {Badge, Button} from 'react-native-elements';

import {LocalizationContext} from '../../services/localization/LocalizationContext';
import Translations from '../../services/localization/Translations';
import {useHeaderHeight} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {setInvoicesState} from '../../services/store/actions/invoices/invoiceActions';
import {fetchAccountDetails} from '../../services/store/actions/account/fetchAccountDetails';
import {fetchInvoices} from '../../services/store/actions/invoices/fetchInvoices';
import {hideNews, hideNewsResetState} from '../../services/store/actions/tools/hideNews';
import {fetchNews} from '../../services/store/actions/tools/fetchNews';
import {formatToLocaleDate} from '../../utilities/date';
import {parseCurrencyToLocale} from '../../utilities/currencies';

import {SUBSCRIPTION_FEATURES} from '../../constants/Params/SubscriptionParams';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import RequestStates from '../../constants/States/RequestStates';
import InvoiceStates from '../../constants/States/InvoiceStates';
import System from '../../constants/System';
import {INVOICE_DIRECTIONS} from '../../constants/Types/InvoiceTypes';

import InvoiceImage from '../../assets/images/features/laskux-kuvitus-ominaisuudet-wide-01.svg';

import TitleText from '../../components/Text/TitleText';
import CustomListItem from '../../components/ListItems/CustomListItem';
import CustomDivider from '../../components/Layout/CustomDivider';
import AntDesignIcon from '../../components/Icons/AntDesignIcon';
import MaterialIcon from '../../components/Icons/MaterialIcon';
import MaterialCommunityIcon from '../../components/Icons/MaterialCommunityIcon';
import PrimaryText from '../../components/Text/PrimaryText';
import EntypoIcon from '../../components/Icons/EntypoIcon';
import Logo from '../../assets/images/logo/laskux-logo-white.svg';
import HeaderMenuButton from '../../components/Buttons/HeaderButtons/HeaderMenuButton';

export default function HomeScreen({navigation}) {
  const parentNavigator = navigation.dangerouslyGetParent();
  const headerHeight = useHeaderHeight();

  const dispatch = useDispatch();

  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchInvoicesState = useSelector((store) => store.fetchInvoices);
  const fetchReceivedInvoicesState = useSelector((store) => store.fetchReceivedInvoices);
  const fetchNewsState = useSelector((store) => store.fetchNews);
  const invoiceActionsState = useSelector((store) => store.invoiceActions);
  const hideNewsState = useSelector((store) => store.hideNews);

  const {locale, currency} = useContext(LocalizationContext);

  const loadNews = useCallback(
    (isRefreshing) => {
      dispatch(fetchNews(account.token, isRefreshing));
    },
    [dispatch, account.token],
  );

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (parentNavigator) {
        const logoHeight = System.os === 'ios' ? headerHeight / 3.5 : headerHeight / 2.5;
        parentNavigator.setOptions({
          headerLeft: () => <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />,
          headerTitle: () => <Logo height={logoHeight} />,
          headerTitleAlign: 'center',
        });
      }
    });
  }, [navigation, parentNavigator, headerHeight]);

  useEffect(() => {
    return navigation.addListener('blur', () => {
      if (parentNavigator) {
        parentNavigator.setOptions({
          headerTitle: null,
        });
      }
    });
  }, [navigation, parentNavigator, headerHeight]);

  useEffect(() => {
    if (hideNewsState.state === RequestStates.SUCCESS) {
      dispatch(hideNewsResetState());
      loadNews(true);
    }
  }, [hideNewsState.state, dispatch, loadNews]);

  const refresh = () => {
    dispatch(fetchAccountDetails(account.token, true));
    dispatch(fetchInvoices(account.token, true));
    loadNews();
  };

  const navToCreateInvoice = () => {
    navigation.navigate('CreateInvoice');
  };

  const navToCreateCustomer = () => {
    navigation.navigate('CreateCustomer');
  };

  const navToCreateItem = () => {
    navigation.navigate('CreateItem');
  };

  const navToCreateReceipt = () => {
    navigation.navigate('CreateReceipt');
  };

  const navigateToInvoices = (invoicesDirection, dynamicState, subState) => {
    requestAnimationFrame(() => {
      dispatch(
        setInvoicesState({
          ...invoiceActionsState,
          invoicesDirection: invoicesDirection,
          dynamicState: dynamicState,
          subState: subState,
        }),
      );
      navigation.navigate('Invoices');
    });
  };

  const isRefreshing = () => {
    return (
      accountDetails.state === RequestStates.REFRESHING ||
      fetchInvoicesState.state === RequestStates.REFRESHING
    );
  };

  const renderNews = () => {
    if (fetchNewsState.news.length > 0) {
      return (
        <View style={styles.newsContainer}>
          <CustomDivider margin={0} />
          <TitleText text={Translations.NEWS} style={styles.subtitle} />
          <CustomDivider margin={0} />
          {fetchNewsState.news.map(({id, title, description, created_at}, index) => {
            const isLoading =
              hideNewsState.state === RequestStates.LOADING && hideNewsState.newsId === id;
            return (
              <View style={styles.newsCard} key={index}>
                <TitleText text={title} />
                <View style={styles.dateLabelContainer}>
                  <EntypoIcon name="calendar" size={18} />
                  <PrimaryText
                    text={formatToLocaleDate(created_at, locale.languageCode)}
                    style={styles.dateLabel}
                  />
                </View>
                <CustomDivider margin={12} />
                <PrimaryText text={description} />
                <CustomDivider margin={12} />
                <Button
                  title={Translations.MARK_AS_READ}
                  onPress={() => dispatch(hideNews(account.token, id))}
                  loading={isLoading}
                />
              </View>
            );
          })}
        </View>
      );
    }
  };

  const renderOutgoingInvoicesOverview = () => {
    const openLength = fetchInvoicesState.invoices.open.length;
    let openAmount = 0;
    const draftLength = fetchInvoicesState.invoices.draft.length;
    let overdueLength = 0;
    let overdueAmount = 0;
    let inCollectionLength = 0;
    let inCollectionAmount = 0;
    for (let i = 0; i < openLength; i++) {
      const {sub_state, total} = fetchInvoicesState.invoices.open[i];
      switch (sub_state) {
        case InvoiceStates.OVERDUE:
          overdueLength++;
          overdueAmount += parseFloat(total);
          break;
        case InvoiceStates.COLLECTION:
          inCollectionLength++;
          inCollectionAmount += parseFloat(total);
          break;
        default:
          break;
      }
      openAmount += parseFloat(total);
    }
    if (openLength > 0 || draftLength > 0 || overdueLength > 0 || inCollectionLength > 0) {
      return (
        <View style={styles.overviewContainer}>
          <CustomDivider margin={0} />
          <TitleText text={Translations.OUTGOING_INVOICES} style={styles.subtitle} />
          <CustomDivider margin={0} />
          {overdueLength > 0 && (
            <CustomListItem
              title={Translations.OVERDUE}
              subtitle={parseCurrencyToLocale(locale.languageTag, currency, overdueAmount)}
              subtitleStyle={styles.overviewItemSubtitle}
              onPress={() =>
                navigateToInvoices(
                  INVOICE_DIRECTIONS.OUTGOING,
                  InvoiceStates.OPEN,
                  InvoiceStates.OVERDUE,
                )
              }
              style={styles.overviewItem}
              rightIcon={
                <Badge
                  badgeStyle={{...styles.badge, backgroundColor: Colors.warning}}
                  textStyle={styles.badgeText}
                  value={overdueLength.toString()}
                />
              }
              bottomDivider
              chevron
            />
          )}
          {inCollectionLength > 0 && (
            <CustomListItem
              title={Translations.COLLECTION}
              onPress={() =>
                navigateToInvoices(
                  INVOICE_DIRECTIONS.OUTGOING,
                  InvoiceStates.OPEN,
                  InvoiceStates.COLLECTION,
                )
              }
              subtitle={parseCurrencyToLocale(locale.languageTag, currency, inCollectionAmount)}
              subtitleStyle={styles.overviewItemSubtitle}
              style={styles.overviewItem}
              rightIcon={
                <Badge
                  badgeStyle={{...styles.badge, backgroundColor: Colors.danger}}
                  textStyle={styles.badgeText}
                  value={inCollectionLength.toString()}
                />
              }
              bottomDivider
              chevron
            />
          )}
          {openLength > 0 && (
            <CustomListItem
              title={Translations.OPEN_INVOICES}
              subtitle={parseCurrencyToLocale(locale.languageTag, currency, openAmount)}
              subtitleStyle={styles.overviewItemSubtitle}
              onPress={() =>
                navigateToInvoices(INVOICE_DIRECTIONS.OUTGOING, InvoiceStates.OPEN, null)
              }
              style={styles.overviewItem}
              rightIcon={
                <Badge
                  badgeStyle={{...styles.badge, backgroundColor: Colors.tintColor}}
                  textStyle={styles.badgeText}
                  value={openLength.toString()}
                />
              }
              bottomDivider
              chevron
            />
          )}
          {draftLength > 0 && (
            <CustomListItem
              title={Translations.DRAFTS}
              onPress={() =>
                navigateToInvoices(INVOICE_DIRECTIONS.OUTGOING, InvoiceStates.DRAFT, null)
              }
              style={styles.overviewItem}
              rightIcon={
                <Badge
                  badgeStyle={{...styles.badge, backgroundColor: Colors.black}}
                  textStyle={styles.badgeText}
                  value={draftLength.toString()}
                />
              }
              bottomDivider
              chevron
            />
          )}
        </View>
      );
    }
  };

  const renderReceivedInvoicesOverview = () => {
    let openAmount = 0;
    const openLength = fetchReceivedInvoicesState.invoices.open.length;
    for (let i = 0; i < openLength; i++) {
      const {total_price} = fetchReceivedInvoicesState.invoices.open[i];
      openAmount += parseFloat(total_price);
    }
    if (openLength > 0) {
      return (
        <View style={styles.overviewContainer}>
          <CustomDivider margin={0} />
          <TitleText text={Translations.RECEIVED_INVOICES} style={styles.subtitle} />
          <CustomDivider margin={0} />
          <CustomListItem
            title={Translations.OPEN_INVOICES}
            subtitle={parseCurrencyToLocale(locale.languageTag, currency, openAmount)}
            subtitleStyle={styles.overviewItemSubtitle}
            onPress={() =>
              navigateToInvoices(INVOICE_DIRECTIONS.RECEIVED, InvoiceStates.OPEN, null)
            }
            style={styles.overviewItem}
            rightIcon={
              <Badge
                badgeStyle={{...styles.badge, backgroundColor: Colors.tintColor}}
                textStyle={styles.badgeText}
                value={openLength.toString()}
              />
            }
            bottomDivider
            chevron
          />
        </View>
      );
    }
  };

  const renderActions = () => {
    return (
      <View style={styles.actionsContainer}>
        <CustomDivider margin={0} />
        <TitleText text={Translations.ACTIONS} style={styles.subtitle} />
        <CustomDivider margin={0} />
        <CustomListItem
          title={Translations.CREATE_INVOICE}
          onPress={navToCreateInvoice}
          leftIcon={<AntDesignIcon name="addfile" />}
          bottomDivider
          chevron
        />
        <CustomListItem
          title={Translations.CREATE_CUSTOMER}
          onPress={navToCreateCustomer}
          leftIcon={<MaterialIcon name="person-add" />}
          bottomDivider
          chevron
        />
        <CustomListItem
          title={Translations.CREATE_ITEM}
          onPress={navToCreateItem}
          leftIcon={<MaterialCommunityIcon name="tag-plus" />}
          bottomDivider
          chevron
        />
        {accountDetails.subscription.plan.features.some(
          (feature) => feature.code === SUBSCRIPTION_FEATURES.RECEIPTS,
        ) && (
          <CustomListItem
            title={Translations.ADD_RECEIPT}
            onPress={navToCreateReceipt}
            leftIcon={<MaterialIcon name="receipt" />}
            bottomDivider
            chevron
          />
        )}
      </View>
    );
  };

  const ReportCard = ({title, imageSrc, onPress, column}) => {
    const card = (
      <View>
        <ImageBackground source={imageSrc} style={styles.reportCardBackground}>
          <TitleText text={title} style={styles.reportCardTitle} />
        </ImageBackground>
      </View>
    );
    return (
      <View
        style={{
          ...styles.reportCardWrapper,
          ...(column === 'left' && styles.reportCardWrapperLeft),
          ...(column === 'right' && styles.reportCardWrapperRight),
        }}>
        {System.os === 'ios' ? (
          <TouchableOpacity onPress={onPress}>{card}</TouchableOpacity>
        ) : (
          <TouchableNativeFeedback onPress={onPress} useForeground>
            {card}
          </TouchableNativeFeedback>
        )}
      </View>
    );
  };

  const renderReports = () => {
    const accountHaveReportsFeature = accountDetails.subscription.plan.features.some(
      ({code}) => code === SUBSCRIPTION_FEATURES.REPORTS,
    );
    if (accountHaveReportsFeature) {
      return (
        <View style={styles.reportsContainer}>
          <CustomDivider margin={0} />
          <TitleText text={Translations.REPORTS} style={styles.subtitle} />
          <CustomDivider marginTop={0} marginBottom={16} />
          <View style={styles.reportCardsContainer}>
            <ReportCard
              title={Translations.SALES_REPORT}
              imageSrc={require('../../assets/images/features/laskux-kuvitus-ominaisuudet-08-cropped.png')}
              onPress={() => navigation.navigate('SalesReport')}
              column="left"
            />
            <ReportCard
              title={Translations.SALES_BY_MONTH}
              imageSrc={require('../../assets/images/features/laskux-kuvitus-ominaisuudet-04-cropped.png')}
              onPress={() => navigation.navigate('SalesByMonth')}
              column="right"
            />
          </View>
          <View style={styles.reportCardsContainer}>
            <ReportCard
              title={Translations.SALES_BY_CUSTOMER}
              imageSrc={require('../../assets/images/features/laskux-kuvitus-ominaisuudet-06-cropped.png')}
              onPress={() => navigation.navigate('SalesByCustomer')}
              column="left"
            />
            <ReportCard
              title={Translations.SALES_BY_ITEM}
              imageSrc={require('../../assets/images/features/laskux-kuvitus-ominaisuudet-07-cropped.png')}
              onPress={() => navigation.navigate('SalesByItem')}
              column="right"
            />
          </View>
        </View>
      );
    }
  };

  const customerHaveInvoices = () => {
    return (
      fetchInvoicesState.invoices.all.length > 0 ||
      fetchReceivedInvoicesState.invoices.all.length > 0
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={isRefreshing()} onRefresh={refresh} />}
      showsVerticalScrollIndicator={false}>
      {!customerHaveInvoices() && (
        <View style={styles.logoContainer}>
          <InvoiceImage width="100%" height="100%" />
        </View>
      )}
      {renderNews()}
      {renderOutgoingInvoicesOverview()}
      {renderReceivedInvoicesOverview()}
      {renderActions()}
      {renderReports()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 48,
  },
  logoContainer: {
    aspectRatio: 2.22,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    borderStyle: 'solid',
  },
  subtitle: {
    backgroundColor: Colors.white,
    fontFamily: Styles.fontBold,
    marginBottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  newsContainer: {
    backgroundColor: Colors.white,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 16,
    paddingBottom: 16,
  },
  newsCard: {
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 12,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  dateLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    marginLeft: 8,
  },
  overviewContainer: {
    marginTop: 16,
  },
  overviewItem: {
    paddingVertical: 12,
  },
  overviewItemSubtitle: {
    fontFamily: Styles.fontSemiBold,
    fontSize: Styles.primaryFontSize,
  },
  badge: {
    borderRadius: Styles.borderRadiusLg,
    height: 28,
    minWidth: 34,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Colors.white,
    fontFamily: Styles.fontBold,
    fontSize: Styles.primaryFontSize,
    textTransform: 'capitalize',
  },
  actionsContainer: {
    marginTop: 16,
  },
  reportsContainer: {
    backgroundColor: Colors.white,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 16,
    paddingBottom: 12,
  },
  reportCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reportCardWrapper: {
    backgroundColor: Colors.white,
    minWidth: '50%',
    maxWidth: System.os === 'ios' ? '100%' : '50%',
    aspectRatio: 1,
    paddingBottom: 12,
  },
  reportCardWrapperLeft: {
    paddingLeft: 12,
    paddingRight: 6,
  },
  reportCardWrapperRight: {
    paddingLeft: 6,
    paddingRight: 12,
  },
  reportCardBackground: {
    aspectRatio: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  reportCardTitle: {
    fontSize: System.isTablet ? Styles.titleSize + 2 : Styles.primaryFontSize,
    marginTop: System.isTablet ? 32 : 12,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
});
