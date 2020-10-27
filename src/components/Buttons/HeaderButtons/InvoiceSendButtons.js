import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';

import Colors from '../../../constants/Colors';

import EntypoIcon from '../../Icons/EntypoIcon';
import MaterialIcon from '../../Icons/MaterialIcon';

export default function InvoiceSendButtons({onSend, onAddAttachment, isSendDisabled}) {
  return (
    <View style={styles.container}>
      {onAddAttachment && (
        <Button
          icon={<EntypoIcon name="attachment" color={Colors.white} size={24} />}
          onPress={onAddAttachment}
          buttonStyle={styles.button}
        />
      )}
      <Button
        icon={
          <MaterialIcon
            name="send"
            size={26}
            color={isSendDisabled ? Colors.lightGray : Colors.white}
          />
        }
        onPress={onSend}
        buttonStyle={styles.button}
        disabled={isSendDisabled}
        disabledStyle={styles.disabledButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: 'transparent',
  },
});
