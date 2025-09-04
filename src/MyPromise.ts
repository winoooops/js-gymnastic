class MyPromise<T = any> {
  static pending = "pending";
  static fulfilled = "fulfilled";
  static rejected = "rejected";

  status: string;
  value: T | undefined;
  reason: any;
  onFulfilledCallbacks: Array<(value: T) => void>;
  onRejectedCallbacks: Array<(reason: any) => void>;

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    this.status = MyPromise.pending;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value: T) => {
      if (this.status === MyPromise.pending) {
        this.status = MyPromise.fulfilled;
        this.value = value;

        while (this.onFulfilledCallbacks.length > 0) {
          const cb = this.onFulfilledCallbacks.shift();
          cb!(value);
        }
      }
    };

    const reject = (reason: any) => {
      if (this.status === MyPromise.pending) {
        this.status = MyPromise.rejected;
        this.reason = reason;
        while (this.onRejectedCallbacks.length > 0) {
          const cb = this.onRejectedCallbacks.shift();
          cb!(reason);
        }
      }
    };

    try {
      console.log("executing the executor function", resolve, reject);
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  static resolvePromise<U>(returnValue: U, resolve: (value: U) => void, reject: (reason: any) => void, newMyPromise: MyPromise<U>): void {
    if (returnValue === newMyPromise) {
      reject(new TypeError("Promise cannot be resolved with itself"));
      return;
    }

    if (returnValue instanceof MyPromise) {
      returnValue.then(resolve, reject);
    } else if (returnValue && typeof (returnValue as any).then === "function") {
      try {
        (returnValue as any).then(resolve, reject);
      } catch (reason) {
        reject(reason);
      }
    } else {
      resolve(returnValue);
    }
  }

  then<U>(onFulfilled?: (value: T) => U | MyPromise<U>, onRejected?: (reason: any) => U | MyPromise<U>): MyPromise<U> {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (success: T) => success as unknown as U;
    onRejected = typeof onRejected === "function" ? onRejected : (reason: any) => {
      throw reason;
    };
    
    return new MyPromise<U>((resolve, reject) => {
      if (this.status === MyPromise.pending) {
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const result = onFulfilled!(this.value as T);
              MyPromise.resolvePromise(result as U, resolve, reject, promise);
            } catch (reason) {
              reject(reason);
            }
          });
        });

        this.onRejectedCallbacks.push(() => {
          try {
            const result = onRejected!(this.reason);
            MyPromise.resolvePromise(result as U, resolve, reject, promise);
          } catch (reason) {
            reject(reason);
          }
        });
      } else if (this.status === MyPromise.fulfilled) {
        queueMicrotask(() => {
          try {
            const result = onFulfilled!(this.value as T);
            MyPromise.resolvePromise(result as U, resolve, reject, promise);
          } catch (reason) {
            reject(reason);
          }
        });
      } else if (this.status === MyPromise.rejected) {
        queueMicrotask(() => {
          try {
            const result = onRejected!(this.reason);
            MyPromise.resolvePromise(result as U, resolve, reject, promise);
          } catch (reason) {
            reject(reason);
          }
        });
      }
    });
  }
}

const promise = new MyPromise((resolve) => resolve(10));

promise
  .then((value) => value * 2)
  .then((value) => value - 1)
  .then((value) => new MyPromise((resolve) => resolve(value * 2)))
  .then((value) => console.log(value));