import md5 from 'md5';

export const formatToLocaleDateTime = (inputDate, languageCode) => {
  if (inputDate) {
    const date = new Date(inputDate);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleTimeString(languageCode, options);
  }
};

export const formatToLocaleDate = (inputDate, languageCode) => {
  if (inputDate) {
    const date = new Date(inputDate);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    return date.toLocaleString(languageCode, options);
  }
};

export const formatToLocaleMonthYear = (inputDate, languageCode) => {
  if (inputDate) {
    const date = new Date(inputDate);
    const options = {
      year: 'numeric',
      month: 'long',
    };
    return date.toLocaleString(languageCode, options);
  }
};

const addLeadingZeroes = (inputString) => {
  return String(`00${inputString}`).slice(-2);
};

export const formatDateYYYYMMDD = (inputDate) => {
  if (inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = addLeadingZeroes(date.getMonth() + 1);
    const day = addLeadingZeroes(date.getDate());
    return `${year}-${month}-${day}`;
  }
};

export const getDateFromBeginningOfYear = () => {
  let date = new Date();
  date.setMonth(0);
  date.setDate(1);
  return date;
};

export const getMd5DateHash = () => {
  return md5(formatDateYYYYMMDD(new Date()));
};
