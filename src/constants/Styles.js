import System from './System';

export default {
  fontBold: System.os === 'ios' ? 'Montserrat-Bold' : 'OpenSans-Bold',
  fontSemiBold: System.os === 'ios' ? 'Montserrat-SemiBold' : 'OpenSans-SemiBold',
  fontRegular: System.os === 'ios' ? 'Montserrat-Regular' : 'OpenSans-Regular',
  titleSize: 18,
  primaryFontSize: 14,
  secondaryFontSize: 12,
  headerFontSize: 17,
  inputFontSize: 14,
  inputSecondaryFontSize: 12,
  tabBarLabelSize: 11,
  borderRadiusSm: 4,
  borderRadiusMd: 12,
  borderRadiusLg: 28,
};
