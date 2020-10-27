import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

import LabelText from '../Text/LabelText';
import AntDesignIcon from '../Icons/AntDesignIcon';

export default function Toast({message, onClose, type}) {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'danger':
        return Colors.danger;
      case 'warning':
        return Colors.warning;
      default:
        return;
    }
  };

  return (
    <View style={{...styles.container, backgroundColor: getBackgroundColor()}}>
      <LabelText text={message} style={styles.message} />
      {onClose && (
        <Button
          type="clear"
          buttonStyle={styles.button}
          onPress={onClose}
          icon={<AntDesignIcon name="close" color={Colors.white} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Styles.borderRadiusSm,
  },
  message: {
    color: Colors.white,
    width: '90%',
  },
  button: {
    backgroundColor: 'transparent',
  },
});
