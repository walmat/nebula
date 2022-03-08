export const typeForProvider = (provider: string) => {
  if (/visa/i.test(provider)) {
    return '001';
  }

  if (/master/i.test(provider)) {
    return '002';
  }

  if (/amex|american/i.test(provider)) {
    return '003';
  }

  if (/maestro/i.test(provider)) {
    return '042';
  }

  if (/discover/i.test(provider)) {
    return '004';
  }

  if (/diners/i.test(provider)) {
    return '005';
  }

  if (/jcb/i.test(provider)) {
    return '007';
  }

  if (/china|cup/i.test(provider)) {
    return '062';
  }

  // default to visa?
  return '001';
};
