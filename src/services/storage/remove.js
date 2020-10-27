import AsyncStorage from '@react-native-community/async-storage';

export const removeFromStorage = (key) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.removeItem(key).then(resolve).catch(reject);
  });
};

export const multiRemoveFromStorage = async (keys) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.multiRemove(keys).then(resolve).catch(reject);
  });
};
