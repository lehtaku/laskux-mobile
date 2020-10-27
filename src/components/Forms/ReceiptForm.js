import React, {useCallback, useEffect, useState} from 'react';

import {Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Image} from 'react-native-elements';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import {DotIndicator} from 'react-native-indicators';

import {useDispatch, useSelector} from 'react-redux';
import {parseDecimalToString} from '../../utilities/calculation';
import {parseCommasAndWhitespaces} from '../../utilities/stringHandling';
import {fetchSellers} from '../../services/store/actions/sellers/fetchSellers';
import Translations from '../../services/localization/Translations';
import {getFieldError} from '../../utilities/validations';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import System from '../../constants/System';
import RequestStates from '../../constants/States/RequestStates';
import {RECEIPT_TYPES} from '../../constants/Types/ReceiptTypes';

import BottomSafeAreaContainer from '../Layout/BottomSafeAreaContainer';
import KeyboardAwareScroll from '../Layout/KeyboardAwareScroll';
import AntDesignIcon from '../Icons/AntDesignIcon';
import DateSelectorInput from '../Inputs/DateSelectorInput';
import TextAreaInput from '../Inputs/TextAreaInput';
import SelectorInput from '../Inputs/SelectorInput';
import ListItemDivider from '../ListItems/ListItemDivider';
import ReceiptRowListItem from '../ListItems/ReceiptRowListItem';
import CustomListItem from '../ListItems/CustomListItem';
import ClearFix from '../Layout/ClearFix';
import EntypoIcon from '../Icons/EntypoIcon';
import MaterialIcon from '../Icons/MaterialIcon';

export default function ReceiptForm({
  navigation,
  formData,
  onChange,
  onSave,
  error,
  showAddAttachmentButton,
}) {
  const dispatch = useDispatch();
  const account = useSelector((store) => store.fetchAccount);
  const accountDetails = useSelector((store) => store.fetchAccountDetails);
  const fetchReceiptAttachmentsState = useSelector((store) => store.fetchReceiptAttachments);
  const fetchSellersState = useSelector((store) => store.fetchSellers);
  const [imagesScroll, setImagesScroll] = useState(null);
  const [scroll, setScroll] = useState(null);
  const [bottomClearFix, setBottomClearFix] = useState(null);
  const [newSellers, setNewSellers] = useState([]);

  const {showActionSheetWithOptions} = useActionSheet();

  const showAttachmentOptions = useCallback(() => {
    Keyboard.dismiss();
    const title = Translations.ADD_ATTACHMENT;
    const options = [
      Translations.TAKE_PHOTO,
      Translations.CHOOSE_FROM_LIBRARY,
      Translations.CANCEL,
    ];
    const icons = [
      <EntypoIcon name="camera" />,
      <EntypoIcon name="archive" />,
      <MaterialIcon name="cancel" />,
    ];
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
          default:
            return;
        }
      },
    );
  }, [showActionSheetWithOptions, openCamera, openImagePicker]);

  const addImage = useCallback(
    (image) => {
      const fileName = image.path.slice(image.path.lastIndexOf('/') + 1);
      onChange((data) => {
        return {
          ...data,
          attachments: [...data.attachments].concat({
            name: fileName,
            data: `data:${image.mime};base64,${image.data}`,
          }),
        };
      });
    },
    [onChange],
  );

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

  useEffect(() => {
    dispatch(fetchSellers(account.token));
  }, [account.token, dispatch]);

  useEffect(() => {
    if (imagesScroll) {
      setTimeout(() => {
        imagesScroll.scrollToEnd();
      }, 250);
    }
  }, [formData.attachments, imagesScroll]);

  const emitChanges = (newData) => {
    onChange({...formData, ...newData});
  };

  const openSelector = (params) => {
    navigation.navigate('SelectorScreen', params);
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

  const addReceiptRow = () => {
    emitChanges({
      rows: formData.rows.concat({
        gross_amount: 0,
        net_amount: 0,
        vat_amount: 0,
        vat_percent: 0,
      }),
    });
  };

  const editReceiptRow = (itemIndex, item) => {
    const editedItem = {
      gross_amount: item.gross_amount,
      net_amount: item.net_amount,
      vat_amount: parseDecimalToString(
        parseCommasAndWhitespaces(item.net_amount) - parseCommasAndWhitespaces(item.gross_amount),
      ),
      vat_percent: item.vat_percent,
    };
    const rowsClone = [...formData.rows];
    rowsClone[itemIndex] = editedItem;
    emitChanges({rows: rowsClone});
  };

  const deleteReceiptRow = (itemIndex) => {
    emitChanges({
      rows: formData.rows.filter((item, index) => index !== itemIndex),
    });
  };

  const getClassificationSelectorData = () => {
    switch (formData.type) {
      case RECEIPT_TYPES.LOSS:
        return accountDetails.profit_and_loss_accounts.loss.map(({id, name}) => {
          return {
            value: id,
            label: name,
          };
        });
      case RECEIPT_TYPES.PROFIT:
        return accountDetails.profit_and_loss_accounts.profit.map(({id, name}) => {
          return {
            value: id,
            label: name,
          };
        });
      default:
        return;
    }
  };

  const selectSeller = (selectedSeller) => {
    if (!selectedSeller) {
      return emitChanges({
        seller: {
          id: null,
          name: null,
        },
      });
    }
    const sellers = fetchSellersState.sellers.concat(newSellers);
    const isExisting = sellers.some((seller) => seller.id === selectedSeller);
    if (isExisting) {
      const existingSeller = sellers.find((seller) => seller.id === selectedSeller);
      emitChanges({
        seller: {
          id: existingSeller.id,
          name: existingSeller.name,
        },
      });
    } else {
      const newSeller = {id: `${selectedSeller}_${newSellers.length}`, name: selectedSeller};
      setNewSellers((data) => {
        const clone = [...data];
        clone.push(newSeller);
        return clone;
      });
      emitChanges({seller: newSeller});
    }
  };

  return (
    <BottomSafeAreaContainer>
      <KeyboardAwareScroll innerRef={setScroll}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.imageScrollContainer}
          ref={setImagesScroll}>
          {fetchReceiptAttachmentsState.state === RequestStates.LOADING ? (
            <DotIndicator color={Colors.tintColor} count={3} size={14} />
          ) : (
            <>
              {formData.attachments.map(({data}, index) => {
                return (
                  <Image
                    key={index}
                    containerStyle={{
                      ...styles.imageContainer,
                      width: Layout.window.width / 2,
                    }}
                    style={styles.image}
                    source={{uri: data}}
                  />
                );
              })}
              {showAddAttachmentButton && (
                <Button
                  onPress={showAttachmentOptions}
                  icon={<AntDesignIcon name="camera" size={32} color={Colors.white} />}
                  containerStyle={styles.cameraButtonContainer}
                  buttonStyle={styles.cameraButton}
                />
              )}
            </>
          )}
        </ScrollView>

        <DateSelectorInput
          label={Translations.DATE}
          value={formData.receipt_date}
          onSelect={(value) => emitChanges({receipt_date: value})}
          error={getFieldError(error, 'receipt_date')}
          tooltip={Translations.RECEIPT_DATE_TOOLTIP}
          topBorder
        />

        <SelectorInput
          label={Translations.PAYMENT_METHOD}
          value={formData.payment_method_id}
          onSelect={(value) => emitChanges({payment_method_id: value})}
          onPress={openSelector}
          data={accountDetails.receipt_payment_methods.map(({id, name}) => {
            return {
              value: id,
              label: name,
            };
          })}
          placeholder={Translations.SELECT_PAYMENT_METHOD}
        />

        <SelectorInput
          label={Translations.EXPENSE_ACCOUNT}
          value={formData.profit_and_loss_account_id}
          onSelect={(value) => emitChanges({profit_and_loss_account_id: value})}
          onPress={openSelector}
          placeholder={Translations.SELECT_EXPENSE_ACCOUNT}
          data={getClassificationSelectorData()}
        />

        <SelectorInput
          label={Translations.SELLER}
          value={formData.seller.id}
          onPress={openSelector}
          onSelect={selectSeller}
          placeholder={Translations.SELECT_SELLER}
          showSearch={true}
          error={getFieldError(error, 'seller')}
          data={fetchSellersState.sellers
            .concat(newSellers)
            .sort((prev, next) => prev.name.toUpperCase() > next.name.toUpperCase())
            .map(({id, name}) => {
              return {
                label: name,
                value: id,
              };
            })}
        />

        <TextAreaInput
          label={Translations.DESCRIPTION}
          value={formData.description}
          onEdit={(value) => emitChanges({description: value})}
          onSubmitEditing={scrollToBottom}
          maxLength={250}
          error={getFieldError(error, 'description')}
        />

        <ListItemDivider title={Translations.RECEIPT_BREAKDOWN} bottomBorder />
        {formData.rows.map((item, index) => (
          <ReceiptRowListItem
            key={index}
            item={item}
            onChange={(value) => editReceiptRow(index, value)}
            onPressSelectVat={openSelector}
            onDelete={() => deleteReceiptRow(index)}
          />
        ))}

        <CustomListItem
          title={Translations.ADD_ROW}
          onPress={addReceiptRow}
          chevron
          bottomDivider
        />
        <ClearFix innerRef={setBottomClearFix} />
      </KeyboardAwareScroll>
      <View style={styles.bottomContainer}>
        <Button
          onPress={onSave}
          title={Translations.SAVE}
          containerStyle={styles.saveButtonContainer}
          buttonStyle={styles.saveButton}
        />
      </View>
    </BottomSafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  imagePreviewContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.border,
    alignItems: 'center',
  },
  imageScrollContainer: {
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
  cameraButtonContainer: {
    justifyContent: 'center',
    marginLeft: 24,
    marginRight: 12,
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  addCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 12,
  },
  bottomContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'solid',
  },
  saveButtonContainer: {
    marginVertical: 16,
    marginHorizontal: 12,
  },
  saveButton: {
    paddingVertical: 12,
  },
});
