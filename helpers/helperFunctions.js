/* eslint-disable import/prefer-default-export */
export const isEmpty = (value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  if (typeof value === 'object') {
    return Object.keys(value).every(key => isEmpty(value[key]));
  }
};

export const toSentenceCase = (value) => {
  const firstChar = value.slice(0, 1).toUpperCase().trim();
  const otherChars = value.slice(1).toLowerCase().trim();
  return `${firstChar}${otherChars}`;
};

export const uuidTester = (inputUUID) => {
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return uuidRegex.test(inputUUID);
};

