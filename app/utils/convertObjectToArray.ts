export const convertObjectToArray = obj => {
  return Object.keys(obj).reduce((acc, id) => {
    return [...acc, obj[id]];
  }, []);
};

export const convertArrayToObject = (
  array: any[],
  key: string,
  value?: string
) =>
  array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: value ? item[value] : item
    };
  }, {});
