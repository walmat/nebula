import { session, BrowserWindow } from 'electron';
import { readFileSync } from 'fs';
import qs from 'query-string';

import { PATHS } from '../../../utils/paths';

export type SessionRequester = {
  id: string;
  completed: any | null;
  data: any;
  active: boolean;
};

export const intercept = (url: string, window: BrowserWindow) => {
  window.webContents.session.protocol.interceptBufferProtocol(
    'https',
    (req: any, callback: any) => {
      if (req.url === url) {
        const html = readFileSync(PATHS.three3dsPath, 'utf8');
        window.webContents.session.protocol.uninterceptProtocol('https');
        return callback({
          mimeType: 'text/html',
          data: Buffer.from(html)
        });
      }
      return callback();
    }
  );
};

export class BrowserManager {
  requesters: {
    [id: string]: SessionRequester;
  };

  browsers: {
    [id: string]: BrowserWindow;
  };

  constructor() {
    this.requesters = {};
    this.browsers = {};
  }

  count = () =>
    Object.values(this.requesters).filter(({ active }) => active).length;

  insert = ({ id, data }: SessionRequester) => {
    this.requesters[id] = {
      id,
      data,
      completed: false,
      active: false
    };
  };

  remove = ({ id }: { id: string }) => {
    if (this.requesters[id]) {
      if (this.browsers[id]) {
        this.browsers[id].close();
        delete this.browsers[id];
      }

      delete this.requesters[id];
    }
  };

  launch = async ({
    id,
    session: _session,
    url,
    proxy,
    userAgent,
    form,
    termUrl
  }: any) => {
    const window = new BrowserWindow({
      center: true,
      transparent: false,
      fullscreenable: false,
      movable: true,
      title: 'Yeezy Supply - 3DSecure',
      show: true,
      width: 450,
      height: 600,
      frame: true,
      resizable: true,
      webPreferences: {
        backgroundThrottling: true,
        session: _session || session.defaultSession
      }
    });

    window.webContents.on('login', (_, __, authInfo, cb) => {
      if (authInfo.isProxy) {
        const [username, password] = proxy
          .split('@')[0]
          .split('http://')[1]
          .split(':');

        cb(username, password);
      }
    });

    window.webContents.userAgent = userAgent;

    window.on('close', () => {
      this.requesters[id].active = false;
      delete this.browsers[id];
    });

    window.webContents.session.webRequest.onBeforeRequest(
      { urls: [termUrl] },
      (details, cb) => {
        window.webContents.session.webRequest.onBeforeRequest(
          { urls: [termUrl] },
          null
        );

        window.close();

        this.requesters[id].data = {
          data: qs.parse(details.uploadData[0].bytes.toString()),
          orderId: form.orderId,
          paymentUrl: `${url}/api/checkout/payment-verification/${form.formFields.EncodedData}`,
          termUrl
        };

        this.requesters[id].completed = true;
        this.requesters[id].active = false;

        cb({ cancel: true });
      }
    );

    this.browsers[id] = window;

    const threeDSecureHtml = `
      <html>
        <body>
          <form method="${form.formMethod}" action="${form.formAction}" id="Cardinal-CCA-Form">
            <input type="hidden" name="PaReq" value="${form.formFields.PaReq}" />
            <input type="hidden" name="MD" value="${form.formFields.MD}" />
            <input type="hidden" name="TermUrl" value="${termUrl}" />
          </form>
          <script>
            document.getElementById("Cardinal-CCA-Form").submit();
          </script>
        </body>
      </html>
      `;

    window.loadURL(`data:text/html,${encodeURIComponent(threeDSecureHtml)}`);
  };
}
