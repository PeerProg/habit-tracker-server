/* eslint-disable import/prefer-default-export */
export const isEmpty = (value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  if (typeof value === 'object') {
    return Object.keys(value).every(key => isEmpty(value[key]));
  }
};
