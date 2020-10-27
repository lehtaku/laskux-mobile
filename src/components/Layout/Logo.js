import React from 'react';

import {StyleSheet} from 'react-native';
import {Image} from 'react-native-elements';
import {DotIndicator} from 'react-native-indicators';

import Colors from '../../constants/Colors';

export default function Logo({source}) {
  const defaultSource = require('../../assets/images/icons/laskux-icon-factory.png');

  return (
    <Image
      source={source ? source : defaultSource}
      containerStyle={styles.logoContainer}
      style={styles.logo}
      borderRadius={85}
      placeholderStyle={styles.placeholder}
      PlaceholderContent={<DotIndicator color={Colors.deepBlue} count={3} size={8} />}
    />
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 85,
  },
  logo: {
    height: 85,
    width: 85,
  },
  placeholder: {
    backgroundColor: Colors.white,
  },
});
