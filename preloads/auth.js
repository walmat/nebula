/* eslint-disable no-return-assign */
/* eslint-disable no-cond-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable promise/always-return */

process.once('loaded', () => {
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require('electron');

  let activationSemaphore = false;
  let statusTimeout = null;

  const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const fadeIn = (element, text, duration) => {
    element.innerHTML = text;
    (function increment(value = 0) {
      element.style.opacity = String(value);
      if (element.style.opacity !== '1') {
        setTimeout(() => {
          increment(value + 0.1);
        }, duration / 10);
      }
    })();
  };

  const fadeOut = (element, text, duration) => {
    (function decrement() {
      (element.style.opacity -= 0.1) < 0
        ? null
        : setTimeout(() => {
            decrement();
          }, duration / 10);
    })();
    setTimeout(() => (element.innerHTML = text), duration);
  };

  document.addEventListener('DOMContentLoaded', () => {
    document
      .getElementById('minimize')
      .addEventListener('click', () =>
        ipcRenderer.invoke('GetCurrentWindow', 'minimize')
      );

    document
      .getElementById('close')
      .addEventListener('click', () =>
        ipcRenderer.invoke('GetCurrentWindow', 'close')
      );

    const submit = document.getElementById('activate');
    const status = document.getElementById('status');
    const loader = document.getElementById('loader-container');

    loader.hidden = true;

    submit.onclick = () => {
      const { value } = document.getElementById('license');

      const license = value.trim();

      const keyFormat = /[a-zA-Z0-9]{5,6}-[a-zA-Z0-9]{5,6}-[a-zA-Z0-9]{5,6}-[a-zA-Z0-9]{5,6}/i;
      const aliasFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      if (!license || !(keyFormat.test(license) || aliasFormat.test(license))) {
        if (statusTimeout) {
          clearTimeout(statusTimeout);
          statusTimeout = null;
          status.innerHTML = '';
        }

        fadeIn(
          status,
          `Invalid key format
          <svg style="margin-left: 2.5px; margin-bottom: -1.75px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10pt" height="10pt" viewBox="0 0 10 10" version="1.1">
            <g id="surface1">
            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:0.25098;" d="M 10 5 C 10 7.761719 7.761719 10 5 10 C 2.238281 10 0 7.761719 0 5 C 0 2.238281 2.238281 0 5 0 C 7.761719 0 10 2.238281 10 5 Z M 10 5 "/>
            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:1;" d="M 2.65625 6.824219 L 6.824219 2.65625 C 6.96875 2.511719 7.199219 2.511719 7.34375 2.65625 C 7.488281 2.800781 7.488281 3.03125 7.34375 3.175781 L 3.175781 7.34375 C 3.03125 7.488281 2.800781 7.488281 2.65625 7.34375 C 2.511719 7.199219 2.511719 6.96875 2.65625 6.824219 Z M 2.65625 6.824219 "/>
            <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:1;" d="M 3.175781 2.65625 L 7.34375 6.824219 C 7.488281 6.96875 7.488281 7.199219 7.34375 7.34375 C 7.199219 7.488281 6.96875 7.488281 6.824219 7.34375 L 2.65625 3.175781 C 2.511719 3.03125 2.511719 2.800781 2.65625 2.65625 C 2.800781 2.511719 3.03125 2.511719 3.175781 2.65625 Z M 3.175781 2.65625 "/>
            </g>
          </svg>
        `,
          150
        );
        statusTimeout = setTimeout(() => {
          fadeOut(status, '', 150);
          clearTimeout(statusTimeout);
          statusTimeout = null;
        }, randomBetween(1500, 2500));
        return;
      }

      if (!activationSemaphore) {
        activationSemaphore = true;
        loader.hidden = false;
        // spoof font-size 0 to "hide" the text
        submit.style.fontSize = 0;

        submit.classList.add('disabled');
        submit.disabled = true;

        if (statusTimeout) {
          clearTimeout(statusTimeout);
          statusTimeout = null;
          status.innerHTML = '';
        }

        ipcRenderer
          .invoke('ActivationCheck', license)
          .then(res => {
            loader.hidden = true;
            submit.style.fontSize = '12px';
            submit.classList.remove('disabled');
            fadeIn(
              status,
              `${res}
            <svg style="margin-left: 2.5px; margin-bottom: -1.75px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10pt" height="10pt" viewBox="0 0 10 10" version="1.1">
              <g id="surface1">
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:0.25098;" d="M 10 5 C 10 7.761719 7.761719 10 5 10 C 2.238281 10 0 7.761719 0 5 C 0 2.238281 2.238281 0 5 0 C 7.761719 0 10 2.238281 10 5 Z M 10 5 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:1;" d="M 2.65625 6.824219 L 6.824219 2.65625 C 6.96875 2.511719 7.199219 2.511719 7.34375 2.65625 C 7.488281 2.800781 7.488281 3.03125 7.34375 3.175781 L 3.175781 7.34375 C 3.03125 7.488281 2.800781 7.488281 2.65625 7.34375 C 2.511719 7.199219 2.511719 6.96875 2.65625 6.824219 Z M 2.65625 6.824219 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:1;" d="M 3.175781 2.65625 L 7.34375 6.824219 C 7.488281 6.96875 7.488281 7.199219 7.34375 7.34375 C 7.199219 7.488281 6.96875 7.488281 6.824219 7.34375 L 2.65625 3.175781 C 2.511719 3.03125 2.511719 2.800781 2.65625 2.65625 C 2.800781 2.511719 3.03125 2.511719 3.175781 2.65625 Z M 3.175781 2.65625 "/>
              </g>
            </svg>
          `,
              150
            );
            statusTimeout = setTimeout(() => {
              fadeOut(status, '', 150);
              clearTimeout(statusTimeout);
              statusTimeout = null;
            }, randomBetween(1500, 2500));
            submit.disabled = false;
            activationSemaphore = false;
          })
          .catch(() => {
            loader.hidden = true;
            fadeIn(
              status,
              `Network error
            <svg style="margin-left: 2.5px; margin-bottom: -1.75px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10pt" height="10pt" viewBox="0 0 10 10" version="1.1">
              <g id="surface1">
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:0.25098;" d="M 10 5 C 10 7.761719 7.761719 10 5 10 C 2.238281 10 0 7.761719 0 5 C 0 2.238281 2.238281 0 5 0 C 7.761719 0 10 2.238281 10 5 Z M 10 5 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:1;" d="M 2.65625 6.824219 L 6.824219 2.65625 C 6.96875 2.511719 7.199219 2.511719 7.34375 2.65625 C 7.488281 2.800781 7.488281 3.03125 7.34375 3.175781 L 3.175781 7.34375 C 3.03125 7.488281 2.800781 7.488281 2.65625 7.34375 C 2.511719 7.199219 2.511719 6.96875 2.65625 6.824219 Z M 2.65625 6.824219 "/>
              <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,22.745098%,36.862745%);fill-opacity:1;" d="M 3.175781 2.65625 L 7.34375 6.824219 C 7.488281 6.96875 7.488281 7.199219 7.34375 7.34375 C 7.199219 7.488281 6.96875 7.488281 6.824219 7.34375 L 2.65625 3.175781 C 2.511719 3.03125 2.511719 2.800781 2.65625 2.65625 C 2.800781 2.511719 3.03125 2.511719 3.175781 2.65625 Z M 3.175781 2.65625 "/>
              </g>
            </svg>
          `,
              150
            );
            submit.style.fontSize = '12px';
            submit.classList.remove('disabled');
            activationSemaphore = false;
          });
      }
    };
  });
});
