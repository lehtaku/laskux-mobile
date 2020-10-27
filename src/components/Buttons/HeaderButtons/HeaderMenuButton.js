import React from 'react';

import {StyleSheet} from 'react-native';

import {Button} from 'react-native-elements';

import Colors from '../../../constants/Colors';

import EntypoIcon from '../../Icons/EntypoIcon';

export default function HeaderMenuButton({onPress}) {
  return (
    <Button
      icon={<EntypoIcon color={Colors.white} name="menu" size={28} />}
      containerStyle={styles.container}
      onPress={onPress}
      buttonStyle={styles.button}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
  },
  button: {
    backgroundColor: 'transparent',
  },
});
