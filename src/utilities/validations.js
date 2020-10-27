export const getFieldError = (error, parentFieldName, childFieldName = null) => {
  if (!error) {
    return null;
  } else if (!error.hasOwnProperty('fields')) {
    return null;
  } else if (error.fields.hasOwnProperty(parentFieldName)) {
    if (error.fields[parentFieldName].hasOwnProperty(childFieldName)) {
      return error.fields[parentFieldName][childFieldName][0];
    }
    return error.fields[parentFieldName][0];
  }
};

export const validateEmail = (input) => {
  const regExpPattern = /\S+@\S+\.\S+/;
  return regExpPattern.test(input);
};

export const startsWithNumber = (input) => {
  const regExpPattern = /^\d/;
  return regExpPattern.test(input);
};

export const isBusinessId = (input) => {
  const regExpPattern = /^[0-9]+(-[0-9]+)+$/;
  return regExpPattern.test(input);
};
