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
