import React from 'react';

import {View, StyleSheet} from 'react-native';

import {Badge} from 'react-native-elements';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

import SingleLineInputContainer from './SingleLineInputContainer';
import EntypoIcon from '../Icons/EntypoIcon';
import PrimaryText from '../Text/PrimaryText';

export default function SelectorInput({
  label,
  data,
  value,
  error,
  onSelect,
  onPress,
  placeholder,
  disablePadding,
  shrink,
  tooltip,
  topBorder,
  iconType,
  showSearch,
}) {
  const parseInputData = () => {
    if (!data) {
      return [];
    } else if (placeholder) {
      return [{label: placeholder, value: null}].concat(data);
    }
    return data;
  };

  const inputData = parseInputData();

  const getInputLabel = () => {
    const selectedValue = inputData.find((item) => item.value === value);
    if (selectedValue) {
      if (selectedValue.label) {
        if (selectedValue.label.length > 22) {
          return selectedValue.label.slice(0, 19).padEnd(22, '.');
        }
        return selectedValue.label;
      }
    } else if (placeholder) {
      return placeholder;
    }
  };

  const onPressHandler = () => {
    onPress({
      title: label,
      onSelect: (item) => onSelect(item.value),
      value: value,
      data: inputData,
      showSearch,
      iconType,
    });
  };

  return (
    <SingleLineInputContainer
      label={label}
      error={error}
      tooltip={tooltip}
      onPress={onPressHandler}
      shrink={shrink}
      topBorder={topBorder}
      disablePadding={disablePadding}>
      <View style={styles.container}>
        <PrimaryText
          style={{
            ...styles.inputValue,
            ...(!label && styles.inputWithoutLabel),
            ...(shrink && styles.inputSmall),
          }}
          text={getInputLabel()}
        />
        <Badge
          value={<EntypoIcon name="chevron-right" size={shrink && 18} />}
          onPress={onPressHandler}
          containerStyle={styles.badgeContainer}
          badgeStyle={styles.badge}
        />
      </View>
    </SingleLineInputContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  inputValue: {
    color: Colors.black,
    fontSize: Styles.inputFontSize,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inputSmall: {
    fontSize: Styles.secondaryFontSize,
    paddingVertical: 6,
  },
  inputWithoutLabel: {
    flex: 1,
    textAlign: 'left',
  },
  badgeContainer: {
    marginLeft: 6,
  },
  badge: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});
