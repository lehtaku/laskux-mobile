import AsyncStorage from '@react-native-community/async-storage';

export const getFromStorage = (key) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key)
      .then((data) => {
        if (data !== null) {
          resolve(JSON.parse(data));
        }
        reject();
      })
      .catch(reject);
  });
};
