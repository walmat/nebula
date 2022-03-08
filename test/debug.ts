import util from 'util';

export const debugConsole = (obj: object) => {
  // eslint-disable-next-line
  console.log(util.inspect(obj, false, null, true));
};
