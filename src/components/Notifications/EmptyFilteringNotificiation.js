import React from 'react';

import {StyleSheet, View} from 'react-native';

import Translations from '../../services/localization/Translations';

import Layout from '../../constants/Layout';

import NoSearchResultsImage from '../../assets/images/icons/laskux-icon-no-search-results.svg';
import TitleText from '../Text/TitleText';
import PrimaryText from '../Text/PrimaryText';

export default function EmptyFilteringNotification({text}) {
  return (
    <View style={styles.container}>
      <NoSearchResultsImage width={Layout.window.width / 2.5} height="50%" />
      <TitleText text={Translations.EMPTY_LISTING} style={styles.title} />
      <PrimaryText text={text} style={styles.text} />
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
  title: {
    marginBottom: 16,
  },
  text: {
    textAlign: 'center',
  },
});
