import React from 'react';

import {StyleSheet} from 'react-native';

import {Button} from 'react-native-elements';

import Colors from '../../../constants/Colors';

import AntDesignIcon from '../../Icons/AntDesignIcon';

export default function HeaderPreviewButton({onPress}) {
  return (
    <Button
      icon={<AntDesignIcon color={Colors.white} name="pdffile1" size={28} />}
      containerStyle={styles.container}
      onPress={onPress}
      buttonStyle={styles.button}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
  },
  button: {
    backgroundColor: 'transparent',
  },
});
