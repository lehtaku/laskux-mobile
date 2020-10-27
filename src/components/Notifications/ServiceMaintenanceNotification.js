import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';
import Translations from '../../services/localization/Translations';

import Layout from '../../constants/Layout';
import Styles from '../../constants/Styles';

import ErrorImage from '../../assets/images/icons/laskux-icon-error-4.svg';
import PrimaryText from '../Text/PrimaryText';
import TitleText from '../Text/TitleText';

export default function ServiceMaintenanceNotification({onPressButton}) {
  return (
    <View style={styles.container}>
      <ErrorImage width={Layout.window.width / 2} height="40%" />
      <TitleText text={`${Translations.ONGOING_MAINTENANCE}!`} style={styles.title} />
      <PrimaryText text={Translations.TRY_AGAIN_IN_A_MOMENT} style={styles.text} />
      <Button title={Translations.TRY_AGAIN} buttonStyle={styles.button} onPress={onPressButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: Styles.borderRadiusLg / 1.25,
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: {
    marginBottom: 16,
  },
  text: {
    textAlign: 'center',
  },
});
