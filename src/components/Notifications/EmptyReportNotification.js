import React from 'react';

import {StyleSheet, View} from 'react-native';

import Translations from '../../services/localization/Translations';

import Layout from '../../constants/Layout';

import NoSearchResultsImage from '../../assets/images/icons/laskux-icon-no-search-results.svg';
import TitleText from '../Text/TitleText';

export default function EmptyReportNotification() {
  return (
    <View style={styles.container}>
      <NoSearchResultsImage width={Layout.window.width / 2.5} height="50%" />
      <TitleText text={Translations.NO_REPORTS} style={styles.title} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
