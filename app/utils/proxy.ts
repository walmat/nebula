export const format = (input?: string) => {
  if (!input || input.startsWith('http') || input === 'localhost') {
    return null;
  }

  return input.split(':');
};
