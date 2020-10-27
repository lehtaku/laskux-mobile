import {IS_PRODUCTION, API_AUTH_USERNAME, API_AUTH_PASSWORD, APP_KEY} from '../../config';
import {encode} from 'base-64';
import System from '../../constants/System';

const basicAuth = `Basic ${encode(`${API_AUTH_USERNAME}:${API_AUTH_PASSWORD}`)}`;

export const parseLoginHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    appVersion: System.appVersion,
    deviceName: System.deviceName,
    operatingSystem: `${System.os} ${System.osVersion}`,
  };
  if (IS_PRODUCTION.toLowerCase() === 'false') {
    return {...headers, Authorization: basicAuth};
  }
  return headers;
};

export const parseHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
    appKey: APP_KEY,
    token,
  };
  if (IS_PRODUCTION.toLowerCase() === 'false') {
    return {...headers, Authorization: basicAuth};
  }
  return headers;
};
