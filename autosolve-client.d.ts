declare module 'autosolve-client';

type Stringify<T> = string;

type AutoSolveCancelProps = Stringify<{
  taskId: string;
  siteKey: string;
}>;

type AutoSolveResponseProps = Stringify<{
  taskId: string;
  token: string;
  createdAt: string;
  request: any; // loosely type this for now...
}>;

type AutoSolveErrorProps = Stringify<{
  type: string;
  event: any; // loosely type this for now...
}>;

interface AutoSolve {
  init: () => Promise<this>;
  ee: AutoSolveEventEmitter;
  cancelAllRequests: () => void;
  errors: {
    INVALID_ACCESS_TOKEN: 'Invalid access token';
    INVALID_CLIENT_ID: 'Invalid client ID';
    INVALID_API_OR_ACCESS_TOKEN: 'Invalid API Key or Access Token';
    TOO_MANY_REQUESTS: 'Too many requests are being attempted. Cooling down';
    CONNECTION_ERROR_INIT: 'Connection error when initializing. Please retry';
    CONNECTION_ERROR: 'Error establishing connection';
    CHANNEL_ERROR: 'Error creating channel';
    EXCHANGE_ERROR: 'Error asserting rabbit exchange';
    QUEUE_ERROR: 'Error asserting queue';
    BINDING_ERROR: 'Error binding queue to exchange';
    MESSAGE_RECEIEVE_ERROR: 'Error receiving message';
    SEND_TOKEN_REQUEST_ERROR: 'Send token request error';
    UNKNOWN_ERROR: 'An unknown error occured';
  };
}

type AutoSolveProps = {
  autoSolve: any;
  id: string;
  url: string;
  proxy?: string;
  siteKey: string;
  version: string;
  action?: string;
  renderParameters?: any;
  platform?: string;
};

interface AutoSolveEventEmitter {
  on(
    event: 'AutoSolveResponse',
    listener: (data: AutoSolveResponseProps) => void
  ): this;
  on(
    event: 'AutoSolveResponse_Cancel',
    listener: (data: AutoSolveCancelProps) => void
  ): this;
  on(
    event: 'AutoSolveError',
    listener: (data: AutoSolveErrorProps) => void
  ): this;
}
