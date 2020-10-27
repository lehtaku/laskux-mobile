import {API_URL} from '../../config';
import {parseHeaders} from './parseHeaders';
import {parseJson} from './parseJson';
import {ERROR_CODES} from '../../constants/Types/ErrorTypes';

export const postRequest = (path, token, data) => {
  if (__DEV__) {
    console.log(`POST ${path}`);
  }
  return new Promise((resolve, reject) => {
    const httpRequestOptions = {
      method: 'POST',
      headers: parseHeaders(token),
      body: JSON.stringify(data),
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
