import now from 'performance-now';

export class Timer {
  _total: number;

  _start: number | null;

  _end: number | null;

  constructor() {
    this._total = 0;
    this._start = null;
    this._end = null;
  }

  /**
   * Starts the timer by setting the start time
   * @param {UTC Timestamp} time - now();
   */
  start(time = now()) {
    this._start = time;
  }

  /**
   * Stops the timer
   */
  stop(time = now()) {
    this._end = time;

    const startTime = this._start || 0;

    this._total += this._end - startTime;
  }

  /**
   * Resets the runtime Timer
   */
  reset() {
    this._start = now();
    this._end = null;
    this._total = 0;
  }

  /**
   * Gets the start time for the Timer
   * @return {UTC Timestamp} - start time of the Timer
   */
  getStartTime() {
    return this._start;
  }

  /**
   * Gets the end time for the Timer
   */
  getEndTime() {
    return this._end;
  }

  /**
   * Gets the runtime of the Timer class
   * @return
   */
  getRunTime(time = now()) {
    const startTime = this._start || 0;

    return Math.floor(time - startTime);
  }

  getTotalTime(fixed = 2) {
    return this._total.toFixed(fixed);
  }
}
