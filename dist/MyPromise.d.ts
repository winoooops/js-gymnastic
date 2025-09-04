declare class MyPromise<T = any> {
    static pending: string;
    static fulfilled: string;
    static rejected: string;
    status: string;
    value: T | undefined;
    reason: any;
    onFulfilledCallbacks: Array<(value: T) => void>;
    onRejectedCallbacks: Array<(reason: any) => void>;
    constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void);
    static resolvePromise<U>(returnValue: U, resolve: (value: U) => void, reject: (reason: any) => void, newMyPromise: MyPromise<U>): void;
    then<U>(onFulfilled?: (value: T) => U | MyPromise<U>, onRejected?: (reason: any) => U | MyPromise<U>): MyPromise<U>;
}
declare const promise: MyPromise<any>;
//# sourceMappingURL=MyPromise.d.ts.map