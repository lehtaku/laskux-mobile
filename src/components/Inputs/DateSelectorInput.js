import React, {useState, useContext} from 'react';

import RNDateTimePicker from '@react-native-community/datetimepicker';

import {View, StyleSheet} from 'react-native';

import {LocalizationContext} from '../../services/localization/LocalizationContext';
import {formatToLocaleDate} from '../../utilities/date';

import {Badge} from 'react-native-elements';

import Colors from '../../constants/Colors';
import System from '../../constants/System';
import Styles from '../../constants/Styles';

import BottomSelector from '../Modals/ios/BottomSelector';
import EntypoIcon from '../Icons/EntypoIcon';
import SingleLineInputContainer from './SingleLineInputContainer';
import PrimaryText from '../Text/PrimaryText';

export default function DateSelectorInput({
  value,
  label,
  onSelect,
  minDate,
  maxDate,
  error,
  shrink,
  disablePadding,
  tooltip,
  topBorder,
}) {
  const inputValue = value ? value : new Date();

  const [isFocused, setFocused] = useState(false);
  const {locale} = useContext(LocalizationContext);

  const IosDateTimePicker = () => (
    <RNDateTimePicker
      value={inputValue}
      onChange={(event, date) => onSelect(date)}
      locale={locale.languageTag}
      minimumDate={minDate}
      maximumDate={maxDate}
    />
  );

  const AndroidDateTimePicker = () => (
    <RNDateTimePicker
      value={inputValue}
      onChange={androidSelectDate}
      minimumDate={minDate}
      maximumDate={maxDate}
    />
  );

  const androidSelectDate = (event, date) => {
    setFocused(false);
    if (date !== undefined) {
      onSelect(date);
    }
  };

  const renderInput = () => {
    return (
      <>
        <PrimaryText
          style={{
            ...styles.inputValue,
            ...(!label && styles.inputWithoutLabel),
            ...(shrink && styles.inputSmall),
          }}
          text={value ? formatToLocaleDate(value, locale.languageCode) : null}
        />
        <Badge
          value={
            <EntypoIcon
              name="calendar"
              size={shrink ? Styles.secondaryFontSize : Styles.primaryFontSize}
              color={isFocused && Colors.tintColor}
            />
          }
          onPress={() => setFocused(true)}
          containerStyle={styles.badgeContainer}
          badgeStyle={styles.badge}
        />
      </>
    );
  };

  const onPressDone = () => {
    onSelect(inputValue);
    setFocused(false);
  };

  return (
    <SingleLineInputContainer
      label={label}
      active={isFocused}
      error={error}
      shrink={shrink}
      onPress={() => setFocused(true)}
      tooltip={tooltip}
      topBorder={topBorder}
      disablePadding={disablePadding}>
      {System.os === 'ios' ? (
        <View style={styles.container}>
          {renderInput()}
          <BottomSelector
            isVisible={isFocused}
            onDone={onPressDone}
            onCancel={() => setFocused(false)}>
            <IosDateTimePicker />
          </BottomSelector>
        </View>
      ) : (
        <View style={styles.container}>
          {renderInput()}
          {isFocused && <AndroidDateTimePicker />}
        </View>
      )}
    </SingleLineInputContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  inputValue: {
    color: Colors.black,
    flex: 1,
    fontSize: Styles.inputFontSize,
    paddingHorizontal: 0,
    paddingVertical: 0,
    textAlign: 'right',
  },
  inputWithoutLabel: {
    textAlign: 'left',
  },
  inputSmall: {
    fontSize: Styles.inputSecondaryFontSize,
    paddingVertical: 8,
  },
  badgeContainer: {
    marginLeft: 6,
  },
  badge: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  active: {
    borderBottomColor: Colors.tintColor,
  },
  clearInputButton: {
    backgroundColor: 'transparent',
    padding: 0,
  },
});
