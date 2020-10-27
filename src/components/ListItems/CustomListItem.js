import React from 'react';

import {StyleSheet, View} from 'react-native';

import {ListItem, Button} from 'react-native-elements';

import Colors from '../../constants/Colors';

import EntypoIcon from '../Icons/EntypoIcon';
import MaterialCommunityIcon from '../Icons/MaterialCommunityIcon';

export default function CustomListItem({
  title,
  titleStyle,
  titleProps,
  subtitle,
  subtitleStyle,
  rightTitle,
  rightTitleStyle,
  rightSubtitle,
  rightSubtitleStyle,
  leftAvatar,
  onPress,
  danger,
  onPressDelete,
  leftIcon,
  rightIcon,
  chevron,
  options,
  topDivider,
  bottomDivider,
  style,
  disabled,
}) {
  const renderChevron = () => {
    if (chevron) {
      return <EntypoIcon name="chevron-right" />;
    } else if (options && onPressDelete) {
      return (
        <View style={styles.rightTitleButtonsContainer}>
          <Button
            icon={<MaterialCommunityIcon name="dots-vertical" />}
            onPress={onPress}
            buttonStyle={{...styles.optionsButton, ...styles.optionsButtonWithPadding}}
          />
          <Button
            icon={<EntypoIcon name="cross" />}
            onPress={onPressDelete}
            buttonStyle={styles.deleteButton}
          />
        </View>
      );
    } else if (options) {
      return (
        <Button
          icon={<MaterialCommunityIcon name="dots-vertical" />}
          onPress={onPress}
          containerStyle={styles.optionsButtonContainer}
          buttonStyle={styles.optionsButton}
        />
      );
    } else if (onPressDelete) {
      return (
        <Button
          containerStyle={styles.deleteButtonContainer}
          icon={<EntypoIcon name="cross" />}
          onPress={onPressDelete}
          buttonStyle={styles.deleteButton}
        />
      );
    }
  };

  return (
    <ListItem
      containerStyle={{
        ...(topDivider && styles.borderTop),
        ...(bottomDivider && styles.borderBottom),
        ...style,
      }}
      title={title}
      titleStyle={{...titleStyle, ...(danger && styles.danger), ...(disabled && styles.disabled)}}
      titleProps={titleProps}
      subtitle={subtitle}
      subtitleStyle={{
        ...styles.subtitle,
        ...subtitleStyle,
        ...(danger && styles.danger),
        ...(disabled && styles.disabled),
      }}
      leftIcon={leftIcon}
      leftAvatar={leftAvatar}
      rightIcon={rightIcon}
      rightTitle={rightTitle}
      rightTitleStyle={{...rightTitleStyle, ...(danger && styles.danger)}}
      rightSubtitle={rightSubtitle}
      rightSubtitleStyle={{
        ...styles.rightSubtitle,
        ...rightSubtitleStyle,
        ...(danger && styles.danger),
      }}
      onPress={onPress}
      underlayColor={Colors.tintColor}
      chevron={renderChevron()}
      disabled={disabled}
    />
  );
}

const styles = StyleSheet.create({
  borderTop: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  borderBottom: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  disabled: {
    color: Colors.gray,
  },
  subtitle: {
    marginTop: 8,
  },
  rightSubtitle: {
    marginTop: 8,
  },
  rightTitleButtonsContainer: {
    flexDirection: 'row',
  },
  deleteButtonContainer: {
    justifyContent: 'center',
  },
  deleteButton: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  optionsButtonContainer: {
    justifyContent: 'center',
  },
  optionsButton: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  optionsButtonWithPadding: {
    paddingRight: 6,
  },
  danger: {
    color: Colors.danger,
  },
});
