import {API_URL} from '../../config';
import {parseJson} from './parseJson';
import {parseHeaders} from './parseHeaders';
import {ERROR_CODES} from '../../constants/Types/ErrorTypes';

export const getRequest = (path, token) => {
  if (__DEV__) {
    console.log(`GET ${path}`);
  }
  return new Promise((resolve, reject) => {
    const httpRequestOptions = {
      method: 'GET',
      headers: parseHeaders(token),
    };
    setTimeout(() => {
      return reject(new Error(ERROR_CODES.REQUEST_TIMED_OUT));
    }, 20000);
    fetch(API_URL + path, httpRequestOptions)
      .then(parseJson)
      .then((response) => {
        if (!response.ok) {
          return reject(response.json.error);
        }
        return resolve(response.json.data);
      })
      .catch((error) => reject(error));
  });
};
