import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Overlay, Button} from 'react-native-elements';
import Translations from '../../services/localization/Translations';

import {getFieldError} from '../../utilities/validations';

import CustomDivider from '../Layout/CustomDivider';
import DateSelectorInput from '../Inputs/DateSelectorInput';
import TitleText from '../Text/TitleText';
import Layout from '../../constants/Layout';

export default function Confirm({
  isVisible,
  isLoading,
  date,
  onConfirm,
  minDate,
  maxDate,
  error,
  onCancel,
  onChangeDate,
}) {
  return (
    <Overlay
      isVisible={isVisible}
      height="auto"
      overlayStyle={styles.overlay}
      animationType="fade"
      onBackdropPress={onCancel}>
      <View style={styles.container}>
        <TitleText text={Translations.MARK_AS_PAID} style={styles.title} />
        <CustomDivider margin={16} />
        <DateSelectorInput
          label={Translations.INVOICE_PAID_DATE}
          error={getFieldError(error, 'paid_date')}
          minDate={minDate}
          maxDate={maxDate}
          value={date}
          onSelect={(value) => onChangeDate(value)}
          disablePadding
        />

        <View style={styles.buttonsContainer}>
          <Button
            title={Translations.CANCEL}
            onPress={onCancel}
            buttonStyle={styles.cancelButton}
          />
          <Button
            title={Translations.OK}
            loading={isLoading}
            onPress={onConfirm}
            buttonStyle={styles.confirmButton}
          />
        </View>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: Layout.window.width - 24,
  },
  container: {
    paddingVertical: 6,
  },
  title: {
    marginBottom: 0,
  },
  buttonsContainer: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginHorizontal: 4,
    paddingHorizontal: 16,
  },
  confirmButton: {
    marginHorizontal: 4,
    paddingHorizontal: 32,
  },
});
