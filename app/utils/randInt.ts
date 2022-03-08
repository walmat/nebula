export const randInt = (min: number, max: number): number => {
  const minimum: number = Math.ceil(min);
  const maximum: number = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};
