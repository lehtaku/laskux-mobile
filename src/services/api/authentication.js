import {API_URL} from '../../config';
import {parseLoginHeaders} from './parseHeaders';
import {parseJson} from './parseJson';
import {ERROR_CODES} from '../../constants/Types/ErrorTypes';

export const authenticate = ({email, password}) => {
  if (__DEV__) {
    console.log(`AUTH ${API_URL}`);
  }
  return new Promise((resolve, reject) => {
    const httpRequestOptions = {
      method: 'POST',
      headers: parseLoginHeaders(),
      body: JSON.stringify({email, password}),
    };
    setTimeout(() => {
      return reject(new Error(ERROR_CODES.REQUEST_TIMED_OUT));
    }, 20000);
    fetch(`${API_URL}/login`, httpRequestOptions)
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
