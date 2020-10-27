import React from 'react';

import {StyleSheet, View} from 'react-native';

import Translations from '../../services/localization/Translations';

import Layout from '../../constants/Layout';

import NoSearchResultsImage from '../../assets/images/icons/laskux-icon-no-search-results.svg';
import TitleText from '../Text/TitleText';

export default function EmptySearchNotification() {
  return (
    <View style={styles.container}>
      <NoSearchResultsImage width={Layout.window.width / 2.5} height="60%" />
      <TitleText text={Translations.NO_SEARCH_RESULTS} />
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
  },
});
