import React from 'react';

import {StyleSheet, ScrollView} from 'react-native';

import CustomListItem from '../ListItems/CustomListItem';
import {Avatar} from 'react-native-elements';

import {getFirstLetter} from '../../utilities/stringHandling';

import Colors from '../../constants/Colors';

export default function AccountSelectList({accounts, onSelectAccount}) {
  const accountsList = accounts.map((account, key) => (
    <CustomListItem
      key={key}
      style={styles.listItemContainer}
      onPress={() => onSelectAccount(account)}
      title={account.account_name}
      leftAvatar={
        <Avatar
          size={56}
          containerStyle={styles.avatarContainer}
          title={getFirstLetter(account.account_name)}
          titleStyle={styles.avatarTitle}
          rounded
        />
      }
      chevron
      bottomDivider
    />
  ));

  return <ScrollView showsVerticalScrollIndicator={false}>{accountsList}</ScrollView>;
}

const styles = StyleSheet.create({
  listItemContainer: {
    paddingVertical: 20,
  },
  avatarContainer: {
    backgroundColor: Colors.tintColor,
  },
  avatarTitle: {
    color: Colors.white,
  },
});
