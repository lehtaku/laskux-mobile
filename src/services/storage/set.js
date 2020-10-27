import AsyncStorage from '@react-native-community/async-storage';

export const setToStorage = (key, value) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(key, JSON.stringify(value)).then(resolve).catch(reject);
  });
};
