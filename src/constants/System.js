import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const os = Platform.OS === 'ios' ? 'ios' : 'android';

export default {
  isTablet: DeviceInfo.isTablet(),
  os,
  osVersion: Platform.Version,
  appVersion: DeviceInfo.getVersion(),
  deviceName: DeviceInfo.getModel(),
};
