/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
// Split out into separate file for clarity
import { forEach } from 'lodash';

/**
 * Resolve the first Promise, Reject when all have failed
 *
 * This method accepts a list of promises and has them
 * compete in a horserace to determine which promise can
 * resolve first (similar to Promise.race). However, this
 * method differs why waiting to reject until ALL promises
 * have rejected, rather than waiting for the first.
 *
 * The return of this method is a promise that either resolves
 * to the first promises resolved value, or rejects with an arra
 * of errors (with indexes corresponding to the promises).
 *
 * @param {List<Promise>} promises list of promises to run
 * @param {String} tag optional tag to attach to log statements
 */
export default (
  promises: Promise<any>[],
  tag: string,
  logger: any,
  id: string
) => {
  const tagStr = tag ? ` - ${tag}` : '';
  return new Promise((resolve, reject) => {
    let errorCount = 0;
    const status = {
      winner: null,
      errors: new Array(promises.length)
    };

    logger.log({
      id,
      level: 'info',
      message: `[ASYNC] RFRL${tagStr}: Attaching Handlers...`
    });

    forEach(promises, (p, idx) => {
      p.then(
        resolved => {
          logger.log({
            id,
            level: 'info',
            message: `[ASYNC] RFRL${tagStr} - ${idx}: RESOLVE`
          });
          if (!status.winner) {
            logger.log({
              id,
              level: 'info',
              message: `[ASYNC] RFRL${tagStr} - ${idx}: Chosen as winner`
            });
            status.winner = resolved;
            resolve(resolved);
          } else {
            logger.log({
              id,
              level: 'info',
              message: `[ASYNC] RFRL${tagStr} - ${idx}: Not chosen as winner`
            });
          }
        },
        error => {
          logger.log({
            id,
            level: 'info',
            message: `[ASYNC] RFRL${tagStr} - ${idx}: REJECTED`
          });
          status.errors[idx] = error;
          errorCount += 1;
          if (errorCount >= status.errors.length && !status.winner) {
            logger.log({
              id,
              level: 'info',
              message: `[ASYNC] RFRL${tagStr} - ${idx}: Final error detected, rejecting.`
            });
            reject(status.errors);
          } else {
            logger.log({
              id,
              level: 'info',
              message: `[ASYNC] RFRL${tagStr} - ${idx}: Not the final error, there's still hope!`
            });
          }
        }
      );
    });

    logger.log({
      id,
      level: 'info',
      message: `[ASYNC] RFRL${tagStr}: Sync work done, waiting on promises...`
    });
  });
};
