import React from 'react';

import {View, StyleSheet} from 'react-native';

import {Button} from 'react-native-elements';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';

import AntDesignIcon from '../Icons/AntDesignIcon';
import MaterialCommunityIcon from '../Icons/MaterialCommunityIcon';

export default function FilteringButton({onPress, isFiltering, onClear}) {
  return (
    <View style={styles.container}>
      {isFiltering && (
        <View style={styles.buttonWrapper}>
          <Button
            onPress={onClear}
            containerStyle={{...styles.buttonContainer, ...styles.clearButtonContainer}}
            buttonStyle={styles.button}
            icon={<MaterialCommunityIcon name="filter-remove-outline" color={Colors.danger} />}
          />
        </View>
      )}
      <View style={styles.buttonWrapper}>
        <Button
          onPress={onPress}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          icon={<AntDesignIcon name="filter" color={Colors.tintColor} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  buttonWrapper: {
    borderRadius: Styles.borderRadiusLg,
    overflow: 'hidden',
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Styles.borderRadiusLg,
  },
  button: {
    backgroundColor: Colors.white,
    borderRadius: Styles.borderRadiusLg,
    padding: 16,
  },
  clearButtonContainer: {
    marginRight: 4,
  },
});
