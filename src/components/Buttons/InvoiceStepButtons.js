import React from 'react';

import {StyleSheet, View} from 'react-native';
import Translations from '../../services/localization/Translations';

import {Button} from 'react-native-elements';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

import EntypoIcon from '../Icons/EntypoIcon';

export default function InvoiceStepButtons({onNext, onBack, onSave, onSend, isNextDisabled}) {
  return (
    <View style={styles.bottomButtonsContainer}>
      {onNext && !onBack && <View style={styles.clearFix} />}
      {onBack && (
        <View style={styles.buttonWrapper}>
          <Button
            onPress={onBack}
            icon={<EntypoIcon name="chevron-left" color={Colors.tintColor} />}
            buttonStyle={{...styles.bottomButton, ...styles.backButton}}
            titleProps={{
              style: {...styles.bottomButtonTitle, ...styles.backButtonTitle},
            }}
            title={Translations.BACK}
          />
        </View>
      )}
      {onSave && (
        <View style={styles.buttonWrapper}>
          <Button
            onPress={onSave}
            buttonStyle={{...styles.bottomButton, ...styles.actionButton}}
            titleProps={{style: styles.bottomButtonTitle}}
            title={Translations.SAVE}
          />
        </View>
      )}
      {onSend && (
        <View style={styles.buttonWrapper}>
          <Button
            onPress={onSend}
            buttonStyle={{...styles.bottomButton, ...styles.actionButton}}
            titleProps={{style: styles.bottomButtonTitle}}
            title={Translations.SEND}
          />
        </View>
      )}
      {onNext && (
        <View style={styles.buttonWrapper}>
          <Button
            onPress={onNext}
            disabled={isNextDisabled}
            icon={
              <EntypoIcon
                name="chevron-right"
                color={isNextDisabled ? Colors.gray : Colors.white}
              />
            }
            iconRight={true}
            buttonStyle={{...styles.bottomButton, ...styles.nextButton}}
            titleProps={{
              style: {
                ...styles.bottomButtonTitle,
                ...styles.nextButtonTitle,
                ...(isNextDisabled && styles.nextButtonTitleDisabled),
              },
            }}
            title={Translations.NEXT}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomButtonsContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'solid',
  },
  buttonWrapper: {
    borderRadius: Styles.borderRadiusLg,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  bottomButton: {
    backgroundColor: Colors.tintColor,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Styles.borderRadiusLg,
  },
  backButton: {
    backgroundColor: Colors.white,
    paddingRight: 12,
    paddingLeft: 6,
  },
  nextButton: {
    backgroundColor: Colors.tintColor,
    paddingRight: 6,
    paddingLeft: 12,
  },
  actionButton: {
    paddingHorizontal: 24,
  },
  bottomButtonTitle: {
    fontFamily: Styles.fontBold,
    fontSize: Styles.primaryFontSize,
    color: Colors.white,
    marginRight: 0,
    paddingBottom: 2,
  },
  backButtonTitle: {
    color: Colors.tintColor,
    fontFamily: Styles.fontRegular,
    marginLeft: 0,
  },
  nextButtonTitle: {
    marginRight: 0,
  },
  nextButtonTitleDisabled: {
    color: Colors.gray,
  },
  clearFix: {
    width: 0,
    height: 0,
  },
});
