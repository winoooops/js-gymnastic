class MyPromise {
  static pending = "pending";
  static fulfilled = "fulfilled";
  static rejected = "rejected";

  constructor(executor) {
    this.status = MyPromise.pending;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // bind the resolve and reject functions to the instance
    const resolve = (value) => {
      if (this.status === MyPromise.pending) {
        this.status = MyPromise.fulfilled;
        this.value = value;

        while (this.onFulfilledCallbacks.length > 0) {
          const cb = this.onFulfilledCallbacks.shift();
          cb(value);
        }
      }
    };

    const reject = (reason) => {
      if (this.status === MyPromise.pending) {
        this.status = MyPromise.rejected;
        this.reason = reason;
        while (this.onRejectedCallbacks.length > 0) {
          const cb = this.onRejectedCallbacks.shift();
          cb(reason);
        }
      }
    };

    try {
      // execute the executor function,
      // which is essentionlly (resolve, reject) => { /** if success, call resolve, if failed, call reject */}
      console.log("executing the executor function", resolve, reject);
      executor(resolve, reject);
    } catch (error) {
      // immediately reject the promise if an error occurs
      reject(error);
    }
  }

  resolvePromise(returnValue, resolve, reject, newMyPromise) {
    // prevent circular reference
    if (returnValue === newMyPromise) {
      reject(new TypeError("Promise cannot be resolved with itself"));
      return;
    }

    // if returnValue is a MyPromise instance, => wait for it's then to be called
    // if returnValue returns a thenable object => try to resolve it, or failed to reject
    // if return value is just another object => resolve it with the value
    if (returnValue instanceof MyPromise) {
      returnValue.then(resolve, reject);
    } else if (returnValue && typeof returnValue.then === "function") {
      try {
        returnValue.then(resolve, reject);
      } catch (reason) {
        reject(reason);
      }
    } else {
      resolve(returnValue);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (success) => success;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    return new Promise((resolve, reject) => {
      if (this.status === MyPromise.pending) {
        // store callback to the executed in the resolve,
        // but use queueMicrotask to ensure it's executed after the current task
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const result = onFulfilled(this.value);
              // recursively call resolvePromise so that if the result is a MyPromise, it could be chained
              this.resolvePromise(result, this.resolve, this.reject, this);
            } catch (reason) {
              this.reject(reason);
            }
          });
        });

        // store callback to the executed in the rejected
        // also use queueMicrotask
        this.onFulfilledCallbacks(() => {
          try {
            const result = onRejected(this.reason);
            this.resolvePromise(result, resolve, reject, this);
          } catch (reason) {
            reject(reason);
          }
        });
      } else if (this.status === MyPromise.fulfilled) {
        queueMicrotask(() => {
          try {
            const result = onFulfilled(this.value);
            this.resolvePromise(result, resolve, reject, this);
          } catch (reason) {
            reject(reason);
          }
        });
      } else if (this.status === MyPromise.rejected) {
        queueMicrotask(() => {
          try {
            const result = onRejected(this.reason);
            this.resolvePromise(result, resolve, reject, this);
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
  .then((value) => value * 2) // promsie to return 20
  .then((value) => value - 1) // promise to return 19
  .then((value) => new MyPromise((resolve) => resolve(value * 2))) // promise to return 38
  .then((value) => console.log(value)); // 38
