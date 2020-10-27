import React from 'react';

import {Linking, RefreshControl, ScrollView, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from 'react-native-elements';

import Translations from '../../services/localization/Translations';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAppVersion} from '../../services/store/actions/tools/fetchAppVersion';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import System from '../../constants/System';
import RequestStates from '../../constants/States/RequestStates';
import {dangerAnimation} from '../../constants/Animations';

import MobileImage from '../../assets/images/icons/laskux-icon-mobile-app.svg';
import TitleText from '../../components/Text/TitleText';
import PrimaryText from '../../components/Text/PrimaryText';

export default function UpdateApplicationScreen() {
  const dispatch = useDispatch();
  const fetchAppVersionState = useSelector((store) => store.fetchAppVersion);
  const dangerToast = useSelector((store) => store.showToast.dangerToast);

  const openStore = async () => {
    try {
      await Linking.openURL(fetchAppVersionState[System.os].app_store_url);
    } catch (error) {
      if (dangerToast) {
        dangerToast.show(Translations.OPENING_STORE_FAILED, dangerAnimation);
      }
    }
  };

  const onRefresh = () => {
    dispatch(fetchAppVersion());
  };

  const isRefreshing = () => {
    return fetchAppVersionState.state === RequestStates.LOADING;
  };

  return (
    <LinearGradient
      colors={[Colors.tintColor, Colors.white, Colors.lightBlue]}
      style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing()} onRefresh={onRefresh} />}
        refreshing={isRefreshing()}>
        <MobileImage width={Layout.window.width / 2} height="40%" />
        <TitleText text={Translations.UPDATE_AVAILABLE} style={styles.title} />
        <PrimaryText text={Translations.UPDATE_DESCRIPTION} style={styles.description} />
        <Button
          title={Translations.UPDATE_NOW}
          onPress={openStore}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
