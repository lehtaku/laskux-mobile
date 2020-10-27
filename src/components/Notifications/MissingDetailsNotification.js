import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';
import Translations from '../../services/localization/Translations';

import Layout from '../../constants/Layout';
import Styles from '../../constants/Styles';

import ErrorImage from '../../assets/images/icons/laskux-icon-error-character-2.svg';
import TitleText from '../Text/TitleText';
import PrimaryText from '../Text/PrimaryText';

export default function MissingDetailsNotification({onPressButton}) {
  return (
    <View style={styles.container}>
      <ErrorImage width={Layout.window.width / 1.75} height="40%" />
      <TitleText text={Translations.MISSING_DETAILS} style={styles.title} />
      <PrimaryText text={Translations.ACCOUNT_INFO_MUST_BE_COMPLETED} style={styles.text} />
      <Button
        title={Translations.FILL_DETAILS}
        buttonStyle={styles.button}
        onPress={onPressButton}
      />
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
