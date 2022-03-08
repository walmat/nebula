process.once('loaded', () => {
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require('electron');

  // utils
  const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms));

  // functions
  const removeCaptcha = () => {
    const myNode = document.getElementById('g-recaptcha');
    while (myNode && myNode.firstChild) {
      myNode.removeChild(myNode.lastChild);
    }
  };

  const removeBadge = async () => {
    const badges = document.querySelectorAll('.grecaptcha-badge');

    if (badges.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const badge of badges) {
        badge.parentNode.parentNode.removeChild(badge.parentNode);
      }
    }
  };

  const loadScript = ({ url, externalFn, location }) => {
    const scriptTag = document.createElement('script');
    scriptTag.src = url;

    if (externalFn) {
      scriptTag.onload = externalFn;
    }

    location.appendChild(scriptTag);
  };

  const unloadScript = () => {
    const scriptSelector = "script[src*='https://www.google.com";
    const scripts = document.querySelectorAll(scriptSelector);

    for (let i = 0; i < scripts.length; i += 1) {
      const script = scripts[i];
      if (script) {
        script.remove();
      }
    }
  };

  const unloadStatic = () => {
    const scriptSelector = "script[src*='https://www.gstatic.com";
    const scripts = document.querySelectorAll(scriptSelector);

    for (let i = 0; i < scripts.length; i += 1) {
      const script = scripts[i];
      if (script) {
        script.remove();
      }
    }
  };

  const unloadIframe = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.parentNode.parentNode.removeChild(iframe.parentNode);
    }
  };

  class CaptchaHandler {
    constructor() {
      this._id = '';
      this._sitekey = '';
      this._action = '';
      this._s = '';
      this._timestamp = null;
      this._checkpoint = false;

      // harvester window details
      this._name = '';
      this._type = '';
      this._platform = '';
      this._theme = 'light';

      // internal state checks
      this._started = false;
      this._loaded = false;
      this._resetting = false;

      // intervals
      this._resizer = null;
    }

    resetData = () => {
      this._id = '';
      this._sitekey = '';
      this._action = '';
      this._s = '';
      this._timestamp = null;
      this._checkpoint = false;
    };

    resetChallenge = async () => {
      this._resetting = true;

      switch (this._version) {
        // v2 checkbox / invisible
        default:
        case 0:
        case 1: {
          if (window.grecaptcha) {
            try {
              window.grecaptcha.reset();
            } catch (e) {
              // noop...
            }

            removeCaptcha();

            window.___grecaptcha_cfg.count = 0;
            window.___grecaptcha_cfg.clients = {};

            delete window.recaptcha;
          }

          break;
        }

        // v3
        case 2:
        case 3: {
          delete window.grecaptcha;
          break;
        }
      }

      await Promise.allSettled([
        removeBadge(),
        unloadScript(),
        unloadStatic(),
        unloadIframe()
      ]);

      this._loaded = false;
      this._resetting = false;
    };

    // NOTE: Not called for v2 checkbox captchas
    execute = () => {
      switch (this._version) {
        // v2 invis
        default:
        case 1:
          return window.grecaptcha.execute();

        case 2:
          this._timestamp = Math.floor((Date.now() + 115000) / 1000);
          return window.grecaptcha
            .execute(this._sitekey, { action: this._action })
            .then(this.onCaptchaSuccess)
            .catch(console.error);
      }
    };

    click = async () => {
      const iframe = document.querySelector(
        'iframe[src^="https://www.google.com/recaptcha/"]'
      );
      const found = iframe.contentDocument || iframe.contentWindow.document;
      if (!iframe) {
        await waitFor(50);
        return this.click();
      }

      const boundingRect = found.querySelector(`.rc-anchor.rc-anchor-normal`);
      if (!boundingRect) {
        await waitFor(50);
        return this.click();
      }

      // this is in the browser scope, so will be defined
      // eslint-disable-next-line no-undef
      virtualpointer.move_to_element_and_click(boundingRect, rand(150, 350));
    };

    onCaptchaSuccess = async token => {
      ipcRenderer.send('HarvestCaptcha', {
        id: this._id,
        platform: this._platform,
        token,
        timestamp: this._timestamp
      });

      await this.resetChallenge();

      return this.resetData();
    };

    onloadCallback = async () => {
      this._loaded = true;

      if (!this._started) {
        return this.resetChallenge();
      }

      switch (this._version) {
        // v2 checkbox
        default:
        case 0: {
          if (
            typeof window.grecaptcha === 'undefined' ||
            typeof window.grecaptcha.render === 'undefined'
          ) {
            await waitFor(50);
            return this.onloadCallback();
          }

          const parameters = {
            sitekey: this._sitekey,
            size: 'normal',
            callback: this.onCaptchaSuccess,
            theme: this._theme
          };

          if (this._s) {
            parameters.s = this._s;
          }

          window.grecaptcha.render('g-recaptcha', parameters);

          await waitFor(rand(50, 150));

          return this.click();
        }

        // v2 invisble
        case 1: {
          if (
            typeof window.grecaptcha === 'undefined' ||
            typeof window.grecaptcha.render === 'undefined'
          ) {
            await waitFor(50);
            return this.onloadCallback();
          }

          window.grecaptcha.render('g-recaptcha', {
            sitekey: this._sitekey,
            size: 'invisible',
            callback: this.onCaptchaSuccess,
            theme: this._theme
          });

          await waitFor(rand(50, 150));

          return this.execute();
        }

        case 2: {
          if (typeof window.grecaptcha === 'undefined') {
            await waitFor(50);
            return this.onloadCallback();
          }
          return window.grecaptcha.ready(this.execute);
        }
      }
    };

    startHarvesting = async (_, { id, version, platform, action, sitekey }) => {
      if (this._started) {
        return;
      }

      if (this._loaded) {
        this.resetChallenge();
      }

      this._started = true;
      this._id = id;
      this._version = version;
      this._action = action;
      this._platform = platform;
      this._sitekey = sitekey;
      this._timestamp = Math.floor((Date.now() + 120000) / 1000);

      const taskIdTag = document.getElementById('harvester-id');
      taskIdTag.innerHTML = `Solving: ${this._id}`;
      taskIdTag.className = 'solving';

      const loader = document.getElementById('loader');
      loader.className = 'hidden';

      const script = `https://www.google.com/recaptcha/api.js`;

      if (version === 0 || version === 1) {
        return loadScript({
          url: `${script}?render=explicit&hl=en`,
          externalFn: this.onloadCallback,
          location: document.body
        });
      }

      return loadScript({
        url: `${script}?render=${sitekey}&hl=en&trustedtypes=true`,
        externalFn: this.onloadCallback,
        location: document.body
      });
    };

    stopHarvesting = async () => {
      if (this._started) {
        this._started = false;

        this.resetChallenge();
        this.resetData();

        const loader = document.getElementById('loader');
        loader.className = 'visible';

        const taskIdTag = document.getElementById('harvester-id');
        taskIdTag.innerHTML = `Not Solving`;
        taskIdTag.className = 'not-solving';
      }
    };

    harvesterData = (_, { name, type, platform, theme }) => {
      if (name) {
        this._name = name;
        const _name = document.getElementById('harvester-name');
        if (_name) {
          _name.innerText = name;
        }
      }

      if (platform) {
        this._platform = platform;
        const _type = document.getElementById('harvester-type');
        if (_type) {
          _type.innerText = `${platform} Harvester`;
        }
      }

      if (type === 'Checkpoint') {
        const minimize = document.getElementById('minimize-btn');
        const close = document.getElementById('close-btn');
        if (minimize) {
          minimize.remove();
        }

        if (close) {
          close.remove();
        }
      }

      if (!this._id) {
        const _id = document.getElementById('harvester-id');
        if (_id) {
          _id.innerText = `Not Solving`;
          _id.class = 'not-solving';
        }
      }

      this._theme = theme === 0 ? 'light' : 'dark';
      document.body.className = theme === 0 ? 'light' : 'dark';
    };

    _onLoad = () => {
      ipcRenderer.on('HarvesterData', this.harvesterData);
      ipcRenderer.on('StartHarvest', this.startHarvesting);
      ipcRenderer.on('StopHarvest', this.stopHarvesting);

      const minimize = document.getElementById('minimize-btn');
      const close = document.getElementById('close-btn');

      if (minimize && close) {
        minimize.onclick = () =>
          ipcRenderer.invoke('GetCurrentWindow', 'minimize');

        close.onclick = () => ipcRenderer.invoke('GetCurrentWindow', 'close');
      }

      // NOTE: adjusts position of recaptcha puzzle window
      this._resizer = setInterval(() => {
        const challengeFrame = document.querySelector(
          'iframe[title="recaptcha challenge"]'
        );
        if (!challengeFrame) {
          return;
        }

        const parentFrame = challengeFrame.parentElement;
        if (!parentFrame) {
          return;
        }

        parentFrame.style.transform = 'scale(0.85)';
      }, 100);
    };

    _onClose = () => {
      clearInterval(this._resizer);
      this._resizer = null;

      ipcRenderer.removeListener('HarvesterData', this.harvesterData);
      ipcRenderer.removeListener('StartHarvestCaptcha', this.startHarvesting);
      ipcRenderer.removeListener('StopHarvestCaptcha', this.stopHarvesting);
    };

    setupWindowHandler = (event, func) => {
      if (window.attachEvent) {
        window.attachEvent(event, func);
      } else if (window[event]) {
        const prevHandler = window[event];
        const newHandler = evt => {
          prevHandler(evt);
          func(evt);
        };
        window[event] = newHandler;
      } else {
        window[event] = func;
      }
    };

    setup = () => {
      const fns = {
        onload: this._onLoad,
        onclose: this._onClose
      };

      Object.entries(fns).map(([event, fn]) =>
        this.setupWindowHandler(event, fn)
      );
    };
  }

  new CaptchaHandler().setup();
});
