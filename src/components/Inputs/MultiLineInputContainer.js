import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import Colors from '../../constants/Colors';
import System from '../../constants/System';

import LabelText from '../Text/LabelText';
import LabelError from '../Text/LabelError';

export default function MultiLineInputContainer({label, active, error, children, onPress}) {
  const renderLabel = () => {
    if (typeof label === 'string') {
      return <LabelText text={label} active={active} style={styles.label} />;
    }
    return label;
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.wrapper}>
        <View style={{...styles.container, ...(active && styles.activeContainer)}}>
          {renderLabel()}
          {children}
        </View>
        {error && <LabelError text={error} style={styles.errorLabel} />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 50,
    marginBottom: 12,
    justifyContent: 'center',
  },
  container: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: System.os === 'ios' ? 12 : 6,
  },
  label: {
    marginBottom: System.os === 'ios' ? 12 : 6,
  },
  activeContainer: {
    borderBottomColor: Colors.tintColor,
  },
  errorLabel: {
    fontSize: 11,
    marginTop: 4,
  },
});
