import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';

import TitleText from '../Text/TitleText';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

export default function EmptyListNotification({text, image, buttonTitle, onPressButton}) {
  return (
    <View style={styles.container}>
      {image}
      <TitleText text={text} style={styles.title} />
      {buttonTitle && onPressButton && (
        <Button title={buttonTitle} buttonStyle={styles.button} onPress={onPressButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBlue,
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
    textAlign: 'center',
  },
});
