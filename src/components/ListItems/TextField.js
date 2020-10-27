import React from 'react';

import {StyleSheet, View, TouchableNativeFeedback, TouchableOpacity} from 'react-native';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

import PrimaryText from '../Text/PrimaryText';
import LabelError from '../Text/LabelError';
import System from '../../constants/System';

export default function TextField({
  title,
  rightTitle,
  titleStyle,
  rightTitleStyle,
  dangerText,
  bottomDivider,
  containerStyle,
  onPress,
}) {
  const getRightTitle = () => {
    if (!rightTitle) {
      return '-';
    }
    return rightTitle.toString();
  };

  const renderContent = () => {
    const textField = (
      <View
        style={{...styles.wrapper, ...containerStyle, ...(bottomDivider && styles.bottomDivider)}}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <PrimaryText
              text={title}
              style={{...styles.title, ...titleStyle, ...(dangerText && styles.danger)}}
            />
          </View>
          <View style={styles.rightTitleContainer}>
            <PrimaryText
              text={getRightTitle()}
              style={{...styles.rightTitle, ...rightTitleStyle, ...(dangerText && styles.danger)}}
            />
          </View>
        </View>
        {dangerText && <LabelError text={dangerText} style={styles.errorText} />}
      </View>
    );
    if (onPress) {
      return System.os === 'ios' ? (
        <TouchableOpacity onPress={onPress}>{textField}</TouchableOpacity>
      ) : (
        <TouchableNativeFeedback onPress={onPress}>{textField}</TouchableNativeFeedback>
      );
    } else {
      return textField;
    }
  };

  return renderContent();
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderStyle: 'solid',
  },
  titleContainer: {
    marginRight: 12,
  },
  rightTitleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    color: Colors.black,
    fontFamily: Styles.fontSemiBold,
    fontSize: Styles.primaryFontSize,
  },
  rightTitle: {
    color: Colors.gray,
    fontFamily: Styles.fontRegular,
    fontSize: Styles.primaryFontSize,
  },
  danger: {
    color: Colors.danger,
  },
  errorText: {
    marginTop: 8,
  },
});
