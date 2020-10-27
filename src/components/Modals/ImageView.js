import React from 'react';

import {StyleSheet} from 'react-native';

import {Button, Image, Overlay} from 'react-native-elements';
import Translations from '../../services/localization/Translations';

import Colors from '../../constants/Colors';

import VerticalSafeAreaContainer from '../Layout/VerticalSafeAreaContainer';

export default function ImageView({isVisible, source, onClose}) {
  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
      onBackdropPress={onClose}
      fullScreen={true}
      animationType="fade">
      <VerticalSafeAreaContainer>
        <Image containerStyle={styles.imageContainer} style={styles.image} source={source} />
        <Button
          title={Translations.CLOSE}
          onPress={onClose}
          containerStyle={styles.closeButtonContainer}
          buttonStyle={styles.closeButton}
        />
      </VerticalSafeAreaContainer>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.border,
    flex: 1,
  },
  image: {
    width: '100%',
    minHeight: '100%',
  },
  closeButtonContainer: {
    marginVertical: 16,
    marginHorizontal: 12,
  },
  closeButton: {
    paddingVertical: 12,
  },
});
