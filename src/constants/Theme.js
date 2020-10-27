import Colors from './Colors';
import Styles from './Styles';

export default {
  Avatar: {
    containerStyle: {
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
  },
  Badge: {
    textStyle: {
      fontFamily: Styles.fontRegular,
      fontSize: Styles.primaryFontSize,
    },
  },
  Button: {
    buttonStyle: {
      backgroundColor: Colors.tintColor,
      borderRadius: Styles.borderRadiusLg,
    },
    loadingProps: {
      color: Colors.white,
    },
    titleStyle: {
      color: Colors.white,
      fontFamily: Styles.fontBold,
    },
  },
  ButtonGroup: {
    selectedButtonStyle: {
      backgroundColor: Colors.tintColor,
    },
    textStyle: {
      color: Colors.tintColor,
      fontFamily: Styles.fontBold,
    },
  },
  ListItem: {
    containerStyle: {
      backgroundColor: Colors.white,
    },
    titleStyle: {
      color: Colors.black,
      fontFamily: Styles.fontSemiBold,
      fontSize: Styles.primaryFontSize,
    },
    subtitleStyle: {
      color: Colors.gray,
      fontFamily: Styles.fontRegular,
      fontSize: Styles.secondaryFontSize,
    },
    rightTitleStyle: {
      color: Colors.black,
      fontFamily: Styles.fontSemiBold,
      fontSize: Styles.primaryFontSize,
    },
    rightSubtitleStyle: {
      color: Colors.gray,
      fontFamily: Styles.fontRegular,
      fontSize: Styles.secondaryFontSize,
    },
  },
};
