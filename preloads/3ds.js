/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */

window.form = null;
window.termUrl = null;

process.once('loaded', () => {
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require('electron');
  const injectData = data => {
    window.form = data.form;

    window.termUrl = data.termUrl;

    document.querySelector('#Cardinal-CCA-Form').submit();
  };

  ipcRenderer.on('InjectData', injectData);
});
