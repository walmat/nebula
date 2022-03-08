/* eslint-disable no-param-reassign */
import { net, IncomingMessage } from 'electron';
import { Timer } from '.';

const defaults = {
  method: 'GET'
};

type Options = {
  url: string;
  method?: string;
  headers?: {
    [key: string]: string;
  };
  proxy?: string;
  encoding?:
    | 'utf8'
    | 'ascii'
    | 'utf-8'
    | 'utf16le'
    | 'ucs2'
    | 'ucs-2'
    | 'base64'
    | 'latin1'
    | 'binary'
    | 'hex'
    | undefined
    | null;
  useSessionCookies?: boolean;
  timeout?: number;
  followRedirect?: boolean;
  followAllRedirects?: boolean;
  body?: any;
  form?: any;
  json?: any;
};

export const request = (
  proxySession: any,
  opts: Options,
  abortEarly = false
): Promise<any> => {
  const {
    url,
    encoding = 'utf8',
    useSessionCookies = true,
    body,
    form,
    json
  } = opts;

  return new Promise((resolve, reject) => {
    try {
      const timer = new Timer();

      const {
        timeout,
        proxy,
        followAllRedirects,
        followRedirect,
        headers,
        ...base
      } = opts;
      if (typeof opts.json === 'boolean') {
        delete base.json;
      }

      const options: any = {
        ...defaults,
        ...base,
        session: proxySession,
        useSessionCookies,
        redirect: followAllRedirects || followRedirect ? 'follow' : 'manual'
      };

      if (headers && headers.origin) {
        const { origin } = headers;
        options.origin = origin;
        delete headers.origin;
      }

      if (headers && headers.Origin) {
        const { Origin } = headers;
        options.origin = Origin;
        delete headers.Origin;
      }

      const request = net.request({ ...options });
      timer.start();

      if (headers) {
        Object.entries(headers).map(([key, value]) => {
          if (key) {
            return request.setHeader(key, value);
          }

          return null;
        });
      }

      if (json && typeof json !== 'boolean') {
        if (typeof json === 'string') {
          request.write(json);
        } else {
          request.write(JSON.stringify(json));
        }
      }

      if (body) {
        request.write(body);
      }

      if (form) {
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        if (typeof form === 'string') {
          request.write(form);
        } else {
          // assume it's an objectified form
          const body = Object.entries(form)
            .map(
              ([key, value]: [any, any]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join('&');
          request.write(body);
        }
      }

      request.on('error', err => {
        try {
          // only if we haven't started receiving a response, time out the request
          timer.stop();
          clearTimeout(timeouter);
          request.abort();
        } catch (e) {
          console.info('[DEBUG] Request.error aborting request error: ', e);
          // Silently let it fail
        }
        return reject(err);
      });

      request.on('login', (_, callback) => {
        if (proxy) {
          const [username, password] = proxy
            .split('@')[0]
            .split('http://')[1]
            .split(':');

          callback(username, password);
        }
      });

      let currentUrl: string = url; // no redirect - set as initial URL
      let respBody: any; // empty body (UTF-8) - can be buffer or string in some cases
      let bufferBody: Buffer; // buffered body
      let redirects: boolean = false; // follow redirects?
      let buffers: Buffer[] = []; // list of Buffers
      let bufferLength: number = 0;
      if (followRedirect || followAllRedirects) {
        redirects = true;
      }

      const timeouter = setTimeout(() => {
        clearTimeout(timeouter);
        request.abort();
        timer.stop();

        const error = new Error('ERR_TIMED_OUT');
        error.name = 'ETIMEDOUT';

        return reject(error);
      }, timeout);

      request.on('response', async (response: IncomingMessage) => {
        // might help save some data on footsites
        // we can detect the statusCode and abort early if so
        if (response.statusCode === 503 && abortEarly) {
          request.abort();
          timer.stop();
          clearTimeout(timeouter);

          const total = timer.getRunTime();

          return resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            body: {},
            time: total,
            request: {
              uri: {
                href: currentUrl
              }
            }
          });
        }

        response.on('error', (error: Error) => {
          try {
            timer.stop();
            clearTimeout(timeouter);
            request.abort();
          } catch (e) {
            console.info('[DEBUG] Response.error aborting request error: ', e);
            // Silently let it fail
          }
          return reject(error);
        });

        response.on('end', () => {
          clearTimeout(timeouter);

          if (bufferLength) {
            bufferBody = Buffer.concat(buffers, bufferLength);
            if (encoding !== null) {
              respBody = bufferBody.toString(encoding);
            } else {
              respBody = bufferBody;
            }

            buffers = [];
            bufferLength = 0;
          }

          if (json) {
            // Try to parse the body
            try {
              respBody = JSON.parse(respBody);
            } catch (e) {
              // Silently fail, it's not parseable
            }
          }

          if (response.headers?.location) {
            [response.headers.location] = response.headers.location;
          }

          try {
            // only if we haven't started receiving a response, time out the request
            timer.stop();
            clearTimeout(timeouter);
            request.abort();
          } catch (e) {
            console.info('[DEBUG] Timeout aborting request error: ', e);
            // Silently let it fail
          }

          const total = timer.getRunTime();

          return resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            body: respBody,
            time: total,
            request: {
              uri: {
                href: currentUrl
              }
            }
          });
        });

        response.on('data', chunk => {
          bufferLength += chunk.length;
          buffers.push(chunk);
        });
      });

      request.on('redirect', (statusCode, _, redirectUrl, responseHeaders) => {
        if (redirects !== false) {
          currentUrl = redirectUrl;
          request.followRedirect();
        } else {
          try {
            // only if we haven't started receiving a response, time out the request
            timer.stop();
            clearTimeout(timeouter);
            request.abort();
          } catch (e) {
            console.info(
              '[DEBUG] Request.redirect aborting request error: ',
              e
            );
            // Silently let it fail
          }

          // hacky ass patch in respBody to avoid a check for `undefined` TypeError
          respBody = `<html><body>You are being <a href="${redirectUrl}">redirected</a>.</body></html>`;

          if (responseHeaders.location) {
            [responseHeaders.location] = responseHeaders.location;
          }

          const total = timer.getRunTime();

          return resolve({
            statusCode,
            headers: responseHeaders,
            body: respBody,
            time: total,
            request: {
              uri: {
                href: currentUrl
              }
            }
          });
        }
      });

      request.end();
    } catch (err) {
      return reject(new Error('Unknown error'));
    }
  });
};
