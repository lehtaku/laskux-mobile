import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Button} from 'react-native-elements';

import Colors from '../../../constants/Colors';

import AntDesignIcon from '../../Icons/AntDesignIcon';

export default function ListingHeaderButtons({onCreate, onSearch}) {
  return (
    <View style={styles.container}>
      <Button
        icon={<AntDesignIcon color={Colors.white} name="search1" size={26} />}
        onPress={onSearch}
        buttonStyle={styles.button}
      />
      <Button
        icon={<AntDesignIcon color={Colors.white} name="plus" size={28} />}
        onPress={onCreate}
        buttonStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
});
