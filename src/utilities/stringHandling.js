const isString = (value) => {
  return typeof value === 'string';
};

export const getFirstLetter = (inputString) => {
  if (!isString(inputString)) {
    return null;
  }
  return inputString[0];
};

export const getFileName = (inputString) => {
  if (!isString(inputString)) {
    return null;
  }
  const lastSlashIndex = inputString.lastIndexOf('/');
  return inputString.substring(lastSlashIndex + 1);
};

export const parseCommasAndWhitespaces = (inputValue) => {
  if (!isString(inputValue)) {
    return null;
  }
  return inputValue.replace(',', '.').replace(/\s/g, '');
};
