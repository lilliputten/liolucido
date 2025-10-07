export class Defer<T> {
  promise: Promise<T>;
  _resolved: boolean = false;
  _rejected: boolean = false;
  _resolve?: (value: T | PromiseLike<T>) => void;
  _reject?: (reason?: unknown) => void;
  // Constructor...
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  // Interface (attention: couldn't be detached from the context)...
  resolve(value: T | PromiseLike<T>) {
    this._resolved = true;
    return this._resolve?.(value);
  }
  reject(reason?: unknown) {
    this._rejected = true;
    return this._reject?.(reason);
  }
  // Status...
  isResolved() {
    return this._resolved;
  }
  isRejected() {
    return this._rejected;
  }
  isFulfilled() {
    return this._resolved || this._resolved;
  }
}
