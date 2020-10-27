import React, {useState} from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
} from 'react-native';

import {Button, Tooltip} from 'react-native-elements';

import System from '../../constants/System';
import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

import LabelText from '../Text/LabelText';
import LabelError from '../Text/LabelError';
import PrimaryText from '../Text/PrimaryText';
import Layout from '../../constants/Layout';
import AntDesignIcon from '../Icons/AntDesignIcon';

export default function SingleLineInputContainer({
  label,
  active,
  error,
  shrink,
  children,
  onPress,
  disablePadding,
  tooltip,
  topBorder,
}) {
  const [inputScroll, setInputScroll] = useState(null);

  const inputScrollHandler = () => {
    if (inputScroll) {
      inputScroll.scrollToEnd();
    }
  };

  const renderLabel = () => {
    const labelComponent = (
      <View style={styles.labelContainer}>
        <LabelText
          text={label}
          active={active}
          style={{...styles.label, ...(shrink && styles.smallLabel)}}
        />
      </View>
    );
    if (tooltip) {
      return (
        <View style={styles.labelWithTooltipContainer}>
          {labelComponent}
          <Tooltip
            width={Layout.window.width - 24}
            height={tooltip.length > 120 ? 150 : 80}
            skipAndroidStatusBar={true}
            popover={<PrimaryText text={tooltip} style={styles.tooltipText} />}
            backgroundColor={Colors.black}>
            <Button
              icon={<AntDesignIcon name="infocirlce" size={Styles.titleSize} />}
              buttonStyle={styles.tooltipButton}
              disabled
            />
          </Tooltip>
        </View>
      );
    }
    return labelComponent;
  };

  const renderInput = () => {
    return (
      <View
        style={{
          ...styles.container,
          ...(error && styles.errorContainer),
          ...(active && styles.active),
          ...(shrink && styles.inputSmall),
          ...(topBorder && styles.containerTopBorder),
          ...(disablePadding && styles.containerWithoutPadding),
        }}>
        <View style={styles.inputWrapper}>
          {label && renderLabel()}
          <View style={styles.inputScrollContainer}>
            <ScrollView
              ref={setInputScroll}
              horizontal={true}
              contentContainerStyle={styles.inputScroll}
              showsHorizontalScrollIndicator={false}
              onContentSizeChange={inputScrollHandler}
              children={children}
            />
          </View>
        </View>
        {error && <LabelError text={error} style={styles.errorLabel} />}
      </View>
    );
  };

  return System.os === 'ios' ? (
    <TouchableOpacity onPress={onPress}>{renderInput()}</TouchableOpacity>
  ) : (
    <TouchableNativeFeedback onPress={onPress}>{renderInput()}</TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    minHeight: 50,
    justifyContent: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 12,
    minWidth: '100%',
  },
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorContainer: {
    minHeight: 60,
    paddingTop: 12,
    paddingBottom: 6,
  },
  containerWithoutPadding: {
    paddingHorizontal: 0,
  },
  containerTopBorder: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputScrollContainer: {
    flex: 1,
  },
  inputScroll: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: '100%',
  },
  inputSmall: {
    minHeight: 0,
    maxHeight: 32.5,
    paddingHorizontal: 0,
  },
  labelContainer: {
    flexDirection: 'column',
  },
  label: {
    marginRight: 10,
  },
  smallLabel: {
    fontSize: Styles.inputSecondaryFontSize,
  },
  labelWithTooltipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tooltipButton: {
    backgroundColor: 'transparent',
    padding: 0,
    marginRight: 8,
  },
  tooltipText: {
    color: Colors.white,
    fontFamily: Styles.fontBold,
    fontSize: Styles.secondaryFontSize,
  },
  errorLabel: {
    fontSize: 11,
    marginTop: System.os === 'ios' ? 4 : 0,
  },
  active: {
    borderBottomColor: Colors.tintColor,
  },
});
