const { useEffect } = require('react');

const ESCAPE_KEY = 27;
const _dependencies: string[] = [];
const _window = window;

export const useEscape = (
  callback: (event: KeyboardEvent) => {},
  { dependencies = _dependencies, window = _window } = {}
) => {
  useEffect(() => {
    if (!window || !window.document || !callback) {
      return;
    }

    if (!Array.isArray(dependencies)) {
      // eslint-disable-next-line no-param-reassign
      dependencies = _dependencies;
      console.warn('Dependencies must be an array!');
    }

    const onKeyPress = (event: KeyboardEvent) =>
      event.keyCode === ESCAPE_KEY && callback(event);
    window.document.addEventListener('keydown', onKeyPress);
    return () => {
      window.document.removeEventListener('keydown', onKeyPress);
    };
  }, dependencies);
};
