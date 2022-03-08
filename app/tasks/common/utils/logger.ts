import * as winston from 'winston';
import * as Bottleneck from 'bottleneck';

import { IS_DEV, IS_PROD, DEBUG_PROD } from '../../../constants/env';

const { printf, combine, colorize } = winston.format;

const levels = {
  supreme: 0, // lowest level of logger so we don't grab anything lower than this
  error: 1,
  warn: 2,
  info: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

const logLevels = {
  levels,
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'blue',
    debug: 'blue',
    silly: 'gray',
    supreme: 'gray'
  }
};
winston.addColors(logLevels);

export const jsonFormatter = (logEntry: any) => {
  const base = { timestamp: new Date() };
  const json = Object.assign(base, logEntry);
  const today = new Date();
  const day = today.toISOString().split('T')[0];
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  // eslint-disable-next-line no-param-reassign
  logEntry.message = `[${day} ${hours}:${minutes}:${seconds}]: ${json.message}`;
  return logEntry;
};

const loggers: any = {};

/**
 * Logger Service. Handles logging with winston. Service handles logging time intervals with bottleneck.
 * Bottleneck, because winston will hang up under heavy load.
 */
export const LoggerService = {
  /** "Bottleneck" Limiter for Logger */
  // eslint-disable-next-line new-cap
  bottleneck: new Bottleneck.default({
    maxConcurrent: 100,
    minTime: 5
  }),
  remove: (id: string) => {
    delete loggers[id];
  },
  /** Winston logger. See https://github.com/winstonjs/winston#creating-your-own-logger for more details  */
  logger: ({ name }: any) => {
    if (loggers[name]) {
      return loggers[name];
    }

    const logger = winston.createLogger({
      levels,
      format: combine(
        colorize(),
        winston.format(jsonFormatter)(),
        printf((info: any) => `[${name}] - ${info.level}: ${info.message}`)
      ),
      transports: new winston.transports.Console({
        level: 'silly',
        silent: !IS_DEV
      })
    });

    loggers[name] = logger;
    return logger;
  },
  /** Returns winston logger */
  getLogger({ name }: any) {
    return LoggerService.logger({ name });
  },
  /**
   * Logs an event with winston
   * @param param0.level Log level. e.g. warn, info, error
   * @param param0.id Task id
   * @param param0.message Log message
   */
  log({ level, id, message }: { level: string; id: string; message: string }) {
    if ((IS_DEV && !DEBUG_PROD) || IS_PROD) {
      return;
    }

    LoggerService.bottleneck.schedule({}, () => {
      return Promise.resolve(
        LoggerService.getLogger({ name: id }).log({ level, message })
      );
    });
  }
};
