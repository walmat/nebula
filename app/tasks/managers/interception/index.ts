import { BrowserWindow, session } from 'electron';
import { isEmpty } from 'lodash';
import { intercept, loadHost } from '../utils';
import { createInterceptionWindow } from './window';

export class InterceptionManager {
  requesters: any;

  window: BrowserWindow;

  active: boolean;

  constructor() {
    this.requesters = {};
    this.window = null;

    this.active = false;
  }

  insert({ id, html }: { id: string; html: string }) {
    this.requesters[id] = {
      id,
      html
    };

    if (!this.window) {
      this.window = createInterceptionWindow(id);
    }

    if (!this.active) {
      // lets render the html, hopefully we dont need to use iframe
      this.active = true;
    }
  }

  intercept = async ({
    window,
    url
  }: {
    window: BrowserWindow;
    url: string;
  }) => {
    // intercept and load the proper host finally..
    intercept(window);

    return loadHost(window, new URL(url).hostname);
  };

  /**
   *
   * @param id task id
   * @param urlFilter array of urls to match. see webRequest.onCompleted options for more details.
   */
  async interceptResponse({
    id,
    urlFilter
  }: {
    id: string;
    urlFilter: string[];
  }) {
    if (!this.window) {
      return undefined;
    }

    const windowSession = session.fromPartition(`persist:${id}`);

    return new Promise(resolve => {
      windowSession.webRequest.onCompleted(
        { urls: urlFilter },
        ({ statusCode, responseHeaders }) => {
          resolve({ statusCode, responseHeaders });
        }
      );
    });
  }

  // make sure to call remove in task after the desired intercepted response is achieved
  remove(id: string) {
    if (this.requesters[id]) {
      delete this.requesters[id];
    }

    // lets remove the html

    if (isEmpty(this.requesters)) {
      this.window.close();
      this.window = null;
      this.active = false;
    }
  }
}
