export const sleep = (time: string | number) =>
  new Promise(resolve => setTimeout(resolve, Number(time)));
