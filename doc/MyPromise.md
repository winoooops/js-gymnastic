# Custom Promise Implementation

This file contains a custom implementation of the Promise class in TypeScript, demonstrating the core concepts of asynchronous programming and promise chaining.

## How It Works Under the Hood

### The Three States
A Promise can be in one of three states:
1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: Operation completed successfully, has a resulting value
3. **Rejected**: Operation failed, has a reason for failure

### The Executor Function
When you create a Promise, you pass an executor function that takes two parameters:
- `resolve(value)`: Called when the async operation succeeds
- `reject(reason)`: Called when the async operation fails

### The Then Method and Chaining
The `then` method is the core of promise chaining:
- Takes two optional callbacks: `onFulfilled` and `onRejected`
- Returns a **new Promise** (this is crucial for chaining)
- If the promise is pending, callbacks are stored for later execution
- If the promise is fulfilled/rejected, callbacks are executed asynchronously

### Microtask Scheduling
Promises use microtasks for asynchronous execution:
- `queueMicrotask()` ensures callbacks run after the current task
- This maintains the asynchronous nature of promises
- Prevents blocking the main thread

### The Resolution Process
The `resolvePromise` method handles different types of returned values:
1. **Primitive values**: Directly resolve with the value
2. **Promise instances**: Wait for the promise to settle
3. **Thenable objects**: Objects with a `then` method
4. **Circular references**: Prevent infinite loops

## Usage Example

```typescript
const promise = new MyPromise((resolve) => resolve(10));

promise
  .then((value) => value * 2)        // 20
  .then((value) => value - 1)        // 19
  .then((value) => new MyPromise((resolve) => resolve(value * 2))) // 38
  .then((value) => console.log(value)); // 38
```

## Key Implementation Details

### Constructor
- Initializes the promise in pending state
- Sets up resolve/reject functions bound to the instance
- Executes the executor function immediately with error handling

### State Management
- **Pending**: Stores callbacks in arrays for later execution
- **Fulfilled**: Executes all success callbacks with the resolved value
- **Rejected**: Executes all failure callbacks with the rejection reason

### Chaining Logic
- Each `then` call creates a **new Promise**
- Return values from callbacks become the new promise's resolved value
- Errors propagate down the chain until caught
- Supports nested promises through the resolution process

### Error Handling
- Errors in executor immediately reject the promise
- Errors in callbacks reject the next promise in the chain
- Unhandled rejections can be caught later in the chain

## Interview-Ready Concepts

### Key Terms to Remember
- **Promise States**: pending, fulfilled, rejected
- **Executor Function**: (resolve, reject) => {}
- **Chaining**: Each `then` returns a new Promise
- **Microtasks**: Asynchronous execution with `queueMicrotask`
- **Thenable**: Objects with `then` method
- **Resolution Process**: Handles different return types

### Common Interview Questions & Answers

**Q: How do Promises avoid callback hell?**
A: Promises provide a cleaner way to handle async operations by allowing chaining with `.then()` instead of nested callbacks. This creates linear, readable code rather than pyramid-shaped nested callbacks.

**Q: What's the difference between `Promise.resolve()` and `new Promise(resolve => resolve())`?**
A: `Promise.resolve()` is a shortcut that creates and immediately resolves a promise, while `new Promise()` gives you more control over when and how the promise resolves. `Promise.resolve()` is also optimized to handle thenable objects.

**Q: How does promise chaining work internally?**
A: Each `.then()` call returns a **new Promise**. The return value from the previous callback becomes the resolved value of the next promise. This creates a chain where each promise waits for the previous one to settle.

**Q: What happens when you return a Promise from a `then` callback?**
A: The returned promise is "unwrapped" - the chain waits for it to settle, and its resolved value becomes the input to the next `.then()` callback. This is handled by the resolution process.

**Q: How do Promises handle errors and rejection propagation?**
A: Errors in the executor or callbacks reject the promise. Rejections propagate down the chain until caught by a `.catch()` or a rejection handler. Unhandled rejections can be caught later in the chain.

### Real-World Applications
- API calls with fetch or axios
- File operations with async/await
- Sequential async operations
- Error handling in complex async flows