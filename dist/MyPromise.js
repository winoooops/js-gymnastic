"use strict";
class MyPromise {
    constructor(executor) {
        this.status = MyPromise.pending;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
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
            console.log("executing the executor function", resolve, reject);
            executor(resolve, reject);
        }
        catch (error) {
            reject(error);
        }
    }
    static resolvePromise(returnValue, resolve, reject, newMyPromise) {
        if (returnValue === newMyPromise) {
            reject(new TypeError("Promise cannot be resolved with itself"));
            return;
        }
        if (returnValue instanceof MyPromise) {
            returnValue.then(resolve, reject);
        }
        else if (returnValue && typeof returnValue.then === "function") {
            try {
                returnValue.then(resolve, reject);
            }
            catch (reason) {
                reject(reason);
            }
        }
        else {
            resolve(returnValue);
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (success) => success;
        onRejected = typeof onRejected === "function" ? onRejected : (reason) => {
            throw reason;
        };
        return new MyPromise((resolve, reject) => {
            if (this.status === MyPromise.pending) {
                this.onFulfilledCallbacks.push(() => {
                    queueMicrotask(() => {
                        try {
                            const result = onFulfilled(this.value);
                            MyPromise.resolvePromise(result, resolve, reject, promise);
                        }
                        catch (reason) {
                            reject(reason);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        const result = onRejected(this.reason);
                        MyPromise.resolvePromise(result, resolve, reject, promise);
                    }
                    catch (reason) {
                        reject(reason);
                    }
                });
            }
            else if (this.status === MyPromise.fulfilled) {
                queueMicrotask(() => {
                    try {
                        const result = onFulfilled(this.value);
                        MyPromise.resolvePromise(result, resolve, reject, promise);
                    }
                    catch (reason) {
                        reject(reason);
                    }
                });
            }
            else if (this.status === MyPromise.rejected) {
                queueMicrotask(() => {
                    try {
                        const result = onRejected(this.reason);
                        MyPromise.resolvePromise(result, resolve, reject, promise);
                    }
                    catch (reason) {
                        reject(reason);
                    }
                });
            }
        });
    }
}
MyPromise.pending = "pending";
MyPromise.fulfilled = "fulfilled";
MyPromise.rejected = "rejected";
const promise = new MyPromise((resolve) => resolve(10));
promise
    .then((value) => value * 2)
    .then((value) => value - 1)
    .then((value) => new MyPromise((resolve) => resolve(value * 2)))
    .then((value) => console.log(value));
//# sourceMappingURL=MyPromise.js.map