import React from 'react';

import {StyleSheet} from 'react-native';

import Pdf from 'react-native-pdf';

import {Button, Overlay} from 'react-native-elements';
import Translations from '../../services/localization/Translations';

import Colors from '../../constants/Colors';

import Loading from '../Indicators/Loading';
import VerticalSafeAreaContainer from '../Layout/VerticalSafeAreaContainer';

export default function PDFModalViewer({isVisible, isLoading, loadingText, source, onClose}) {
  const renderContent = () => {
    if (isLoading) {
      return <Loading text={loadingText} />;
    } else {
      return <Pdf source={source} style={styles.pdf} />;
    }
  };

  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
      onBackdropPress={onClose}
      fullScreen={true}
      animationType="fade">
      <VerticalSafeAreaContainer>
        {renderContent()}
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
  pdf: {
    flex: 1,
    width: '100%',
    borderStyle: 'solid',
    borderColor: Colors.border,
    borderWidth: 1,
  },
  closeButtonContainer: {
    marginVertical: 16,
    marginHorizontal: 12,
  },
  closeButton: {
    paddingVertical: 12,
  },
});
