import React, {useCallback, useContext, useEffect, useState} from 'react';

import {
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {Image} from 'react-native-elements';
import {DotIndicator} from 'react-native-indicators';

import {useDispatch, useSelector} from 'react-redux';
import {fetchReceipt} from '../../services/store/actions/receipts/fetchReceipt';
import Translations from '../../services/localization/Translations';
import {formatToLocaleDate} from '../../utilities/date';
import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {fetchReceiptAttachments} from '../../services/store/actions/receipts/fetchReceiptAttachments';
import {parseCurrencyToLocale} from '../../utilities/currencies';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import KeyboardAwareScroll from '../../components/Layout/KeyboardAwareScroll';
import ListItemDivider from '../../components/ListItems/ListItemDivider';
import TextField from '../../components/ListItems/TextField';
import RequestStates from '../../constants/States/RequestStates';
import Loading from '../../components/Indicators/Loading';
import ErrorNotification from '../../components/Notifications/ErrorNotification';
import CustomListItem from '../../components/ListItems/CustomListItem';
import System from '../../constants/System';
import ImageView from '../../components/Modals/ImageView';
import {fetchSellers} from '../../services/store/actions/sellers/fetchSellers';

export default function ViewReceiptScreen({route}) {
  const receipt = route.params?.receipt;

  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchReceiptState = useSelector((store) => store.fetchReceipt);
  const fetchReceiptAttachmentsState = useSelector((store) => store.fetchReceiptAttachments);
  const fetchSellersState = useSelector((store) => store.fetchSellers);
  const {locale, currency} = useContext(LocalizationContext);
  const [isViewAttachmentVisible, setIsViewAttachmentVisible] = useState(false);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);

  const loadData = useCallback(() => {
    dispatch(fetchReceipt(receipt.id, account.token));
    dispatch(fetchReceiptAttachments(receipt.id, account.token));
    dispatch(fetchSellers(account.token));
  }, [account.token, dispatch, receipt.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getPaymentMethod = () => {
    const method = accountDetails.receipt_payment_methods.find(
      (itemToFind) => itemToFind.id === fetchReceiptState.receipt.payment_method_id,
    );
    if (method) {
      return method.name;
    }
  };

  const getClassification = () => {
    const classification = accountDetails.profit_and_loss_accounts[receipt.type].find(
      (itemToFind) => itemToFind.id === fetchReceiptState.receipt.profit_and_loss_account_id,
    );
    if (classification) {
      return classification.name;
    }
  };

  const openAttachment = (index) => {
    setSelectedAttachmentIndex(index);
    setIsViewAttachmentVisible(true);
  };

  const getAttachmentSource = () => {
    if (fetchReceiptAttachmentsState.attachments.length) {
      return {
        uri: `data:${fetchReceiptAttachmentsState.attachments[selectedAttachmentIndex].mime_type};base64,${fetchReceiptAttachmentsState.attachments[selectedAttachmentIndex].file}`,
      };
    }
  };

  const getSeller = () => {
    const seller = fetchSellersState.sellers.find(
      (sellerToFind) => sellerToFind.id === fetchReceiptState.receipt.seller_id,
    );
    if (seller) {
      return seller.name;
    }
  };

  const renderContent = () => {
    switch (fetchReceiptState.state) {
      case RequestStates.LOADING:
        return <Loading text={Translations.LOADING_RECEIPT} />;
      case RequestStates.ERROR:
        return (
          <ErrorNotification
            message={Translations.LOADING_RECEIPTS_FAILED}
            onPressButton={() => loadData()}
          />
        );
      case RequestStates.SUCCESS:
        return (
          <View style={styles.container}>
            <KeyboardAwareScroll>
              <ScrollView horizontal={true} contentContainerStyle={styles.imagesScrollContainer}>
                {fetchReceiptAttachmentsState.state === RequestStates.LOADING ? (
                  <DotIndicator color={Colors.tintColor} count={3} size={14} />
                ) : (
                  fetchReceiptAttachmentsState.attachments.map(({file, mime_type}, index) => {
                    const image = (
                      <Image
                        key={index}
                        containerStyle={{
                          ...styles.imageContainer,
                          width: Layout.window.width / 2,
                        }}
                        style={styles.image}
                        source={{uri: `data:${mime_type};base64,${file}`}}
                      />
                    );
                    if (System.os === 'ios') {
                      return (
                        <TouchableOpacity onPress={() => openAttachment(index)} children={image} />
                      );
                    } else if (System.os === 'android') {
                      return (
                        <TouchableNativeFeedback
                          onPress={() => openAttachment(index)}
                          children={image}
                        />
                      );
                    }
                  })
                )}
              </ScrollView>
              <ListItemDivider title={Translations.INVOICE_DETAILS} borders />
              <TextField
                title={Translations.DESCRIPTION}
                rightTitle={fetchReceiptState.receipt.description}
                bottomDivider
              />
              <TextField
                title={Translations.DATE}
                rightTitle={formatToLocaleDate(
                  fetchReceiptState.receipt.receipt_date,
                  locale.languageCode,
                )}
                bottomDivider
              />
              <TextField
                title={Translations.CLASSIFICATION}
                rightTitle={getClassification()}
                bottomDivider
              />
              <TextField
                title={Translations.PAYMENT_METHOD}
                rightTitle={getPaymentMethod()}
                bottomDivider
              />
              <TextField title={Translations.SELLER} rightTitle={getSeller()} bottomDivider />

              {fetchReceiptState.receipt.rows.length && (
                <>
                  <ListItemDivider title={Translations.RECEIPT_BREAKDOWN} bottomBorder />
                  {fetchReceiptState.receipt.rows.map(({vat_percent, net_amount}, index) => {
                    return (
                      <CustomListItem
                        key={index}
                        title={`${vat_percent} %`}
                        rightTitle={parseCurrencyToLocale(locale.languageTag, currency, net_amount)}
                        bottomDivider
                      />
                    );
                  })}
                </>
              )}
            </KeyboardAwareScroll>
            <ImageView
              isVisible={isViewAttachmentVisible}
              onClose={() => setIsViewAttachmentVisible(false)}
              source={getAttachmentSource()}
            />
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
  imagePreviewContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.border,
    alignItems: 'center',
  },
  imagesScrollContainer: {
    backgroundColor: Colors.white,
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  imageContainer: {
    aspectRatio: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
