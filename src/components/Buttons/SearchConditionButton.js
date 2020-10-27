import React from 'react';

import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';

import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

import PrimaryText from '../Text/PrimaryText';
import EntypoIcon from '../Icons/EntypoIcon';

export default function SearchConditionButton({title, onPress}) {
  return (
    <View style={styles.filteringButtonView}>
      <PrimaryText text={title} style={styles.text} />
      <Button
        icon={<EntypoIcon name="cross" />}
        onPress={onPress}
        buttonStyle={styles.filteringButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filteringButtonView: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Styles.borderRadiusLg,
    flexDirection: 'row',
    marginRight: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  text: {
    marginBottom: 2,
  },
  filteringButton: {
    backgroundColor: 'transparent',
    padding: 0,
    paddingLeft: 6,
  },
});
