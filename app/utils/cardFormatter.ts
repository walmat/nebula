export function limit(val, max) {
  let ret = val;
  if (ret.length === 1 && ret[0] > max[0]) {
    ret = `0${val}`;
  }

  if (ret.length === 2) {
    if (Number(ret) === 0) {
      ret = '01';

      // this can happen when user paste number
    } else if (ret > max) {
      ret = max;
    }
  }

  return ret;
}

export function cardExpiry(val) {
  const month = limit(val.substring(0, 2), '12');
  const year = val.substring(2, 4);

  return month + (year.length ? `/${year}` : '');
}
