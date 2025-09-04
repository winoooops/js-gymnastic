# JavaScript: `this`, Arrow Functions, Prototypes, and `call` / `apply` / `bind`

This file compares key JavaScript concepts between ES5 and ES6, focusing on practical differences and interview-ready knowledge.

## How It Works Under the Hood

### `this` and Arrow Functions (ES5 vs ES6)

#### Normal Functions (`function`)
- `this` is decided by the *call site*
- Rules:
  1. **Default call**: global object (sloppy mode) or `undefined` (strict mode)
  2. **Implicit call**: `obj.fn()` ⇒ `this === obj`
  3. **Explicit binding**: `call` / `apply` / `bind`
  4. **Constructor call**: `new Fn()` ⇒ `this` is the new instance

#### Arrow Functions (`=>`)
- Do not have their own `this`, `arguments`, `super`, or `new.target`
- Capture `this` from the surrounding scope (lexical binding)
- Cannot be used as constructors (no `prototype`)
- `call` / `apply` / `bind` cannot change their `this`

### Prototype Chain and Inheritance

#### `prototype` vs `__proto__` - The Key Difference

**`prototype` (exists on functions)**
- Only functions have a `prototype` property
- This is what becomes the prototype of objects created with `new`
- Used when you want to add methods that will be shared by all instances

**`__proto__` (exists on objects)**
- All objects have a `__proto__` property (legacy accessor)
- This points to the object's actual prototype
- It's the internal `[[Prototype]]` made visible
- Modern equivalent: `Object.getPrototypeOf(obj)`

#### Visual Example

```javascript
// Constructor function
function Person(name) {
  this.name = name;
}

// Adding methods to the prototype (shared by all instances)
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

// Creating instances
const alice = new Person('Alice');
const bob = new Person('Bob');

// The relationships:
// Person.prototype -> { greet: function, constructor: Person }
// alice.__proto__ -> Person.prototype
// bob.__proto__ -> Person.prototype
// Person.prototype.__proto__ -> Object.prototype
// Object.prototype.__proto__ -> null

console.log(alice.__proto__ === Person.prototype); // true
console.log(bob.__proto__ === Person.prototype);   // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

#### Prototype Chain in Action

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  return `${this.name} is eating`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance: Dog.prototype.__proto__ = Animal.prototype
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const myDog = new Dog('Rex', 'German Shepherd');

// Property lookup chain:
// 1. myDog itself (has name, breed)
// 2. myDog.__proto__ -> Dog.prototype (has bark, constructor)
// 3. Dog.prototype.__proto__ -> Animal.prototype (has eat)
// 4. Animal.prototype.__proto__ -> Object.prototype (has toString, etc.)
// 5. Object.prototype.__proto__ -> null

console.log(myDog.name);        // "Rex" (found on myDog)
console.log(myDog.breed);       // "German Shepherd" (found on myDog)
console.log(myDog.bark());      // "Rex barks!" (found on Dog.prototype)
console.log(myDog.eat());       // "Rex is eating" (found on Animal.prototype)
console.log(myDog.toString()); // "[object Object]" (found on Object.prototype)
```

#### Practical Usage Example

```javascript
// Creating a reusable validation utility
function Validator() {
  this.errors = [];
}

Validator.prototype.addError = function(message) {
  this.errors.push(message);
  return this; // For method chaining
};

Validator.prototype.hasErrors = function() {
  return this.errors.length > 0;
};

Validator.prototype.getErrors = function() {
  return this.errors;
};

// Extending for specific validation needs
function FormValidator() {
  Validator.call(this); // Call parent constructor
}

FormValidator.prototype = Object.create(Validator.prototype);
FormValidator.prototype.constructor = FormValidator;

FormValidator.prototype.validateEmail = function(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    this.addError('Invalid email format');
  }
  return this;
};

FormValidator.prototype.validateRequired = function(value, fieldName) {
  if (!value || value.trim() === '') {
    this.addError(`${fieldName} is required`);
  }
  return this;
};

// Usage
const validator = new FormValidator();
validator
  .validateRequired('', 'Name')
  .validateEmail('invalid-email')
  .validateEmail('valid@example.com');

console.log(validator.hasErrors()); // true
console.log(validator.getErrors()); // ["Name is required", "Invalid email format"]
```

#### Performance Benefits

```javascript
// Memory efficient - methods are shared
function User(name) {
  this.name = name;
}

// This method is created once and shared by all instances
User.prototype.getName = function() {
  return this.name;
};

// Creating 1000 instances
const users = [];
for (let i = 0; i < 1000; i++) {
  users.push(new User(`User${i}`));
}

// All instances share the same getName method
console.log(users[0].getName === users[1].getName); // true
console.log(users[0].getName === users[999].getName); // true
```

#### Inheritance with `class` (ES6)

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    return `${this.name} is eating`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Must call super() before using this
    this.breed = breed;
  }
  
  bark() {
    return `${this.name} barks!`;
  }
}

const myDog = new Dog('Rex', 'German Shepherd');

// The prototype relationships:
// Dog.prototype.__proto__ === Animal.prototype
// Dog.__proto__ === Animal
// myDog.__proto__ === Dog.prototype

console.log(myDog instanceof Dog);    // true
console.log(myDog instanceof Animal); // true
console.log(myDog instanceof Object); // true
```

### `call`, `apply`, and `bind`

| Method | Executes Now? | Arguments | Changes `this` | Arrow Functions | Use Case |
|--------|---------------|-----------|----------------|-----------------|----------|
| `call` | ✅ Yes | Separate list `a, b, c` | ✅ (normal functions) | ❌ | Immediate with discrete args |
| `apply` | ✅ Yes | Single array `[a, b, c]` | ✅ (normal functions) | ❌ | Immediate with array/arguments |
| `bind` | ❌ No | Pre-set + later args | ✅ (hard bind) | ❌ | Context in callbacks, partial functions |

## Usage Example

```javascript
const counter = {
  n: 0,
  inc(step) {
    this.n += step;
  },
};

// ❌ Lost `this`
const false_incBy2 = counter.inc;
false_incBy2(2);
console.log(counter.n); // 0  (this is undefined in strict mode)

// ✅ bind
const incBy2 = counter.inc.bind(counter);
incBy2(2);
console.log(counter.n); // 2

// ✅ call
counter.inc.call(counter, 3);
console.log(counter.n); // 5  (2 + 3)

// ✅ apply
counter.inc.apply(counter, [4]);
console.log(counter.n); // 9  (5 + 4)
```

## Key Implementation Details

### Arrow Function Implementation
- Lexically scoped `this` (no dynamic binding)
- No `arguments` object (use rest parameters instead)
- No `prototype` property
- Cannot be used with `new`

### Prototype Chain Resolution
- JavaScript looks for properties on the object first
- If not found, it searches up the prototype chain
- This continues until `Object.prototype` or `null`

### Context Binding Methods
- `call` and `apply` execute immediately with different argument formats
- `bind` returns a new function with pre-set `this` and arguments
- These methods don't work on arrow functions

## Interview-Ready Concepts

### Key Terms to Remember
- **Lexical `this`**: Arrow functions capture `this` from surrounding scope
- **Dynamic `this`**: Normal functions have `this` determined by call site
- **Prototype Chain**: Object inheritance mechanism in JavaScript
- **`[[Prototype]]`**: Internal property linking objects to their prototype
- **Constructor Function**: Function used with `new` to create objects
- **Context Binding**: Methods to control `this` value (`call`, `apply`, `bind`)
- **`prototype`**: Property on functions that becomes the prototype of created objects
- **`__proto__`**: Legacy accessor for an object's actual prototype
- **Method Sharing**: Multiple instances share the same prototype methods
- **Inheritance**: Objects inherit properties and methods from their prototype

### Common Interview Questions & Answers

**Q: What's the difference between arrow functions and regular functions regarding `this`?**
A: Arrow functions have lexical `this` (captured from surrounding scope), while regular functions have dynamic `this` (determined by how they're called). Arrow functions cannot be used as constructors and don't have their own `arguments` object.

**Q: When would you use `call` vs `apply` vs `bind`?**
A: Use `call` when you have discrete arguments and want immediate execution. Use `apply` when you have arguments as an array. Use `bind` when you want to create a new function with a fixed `this` context for later use, like in callbacks.

**Q: How does the prototype chain work in JavaScript?**
A: When accessing a property, JavaScript first checks the object itself. If not found, it looks at the object's prototype, then the prototype's prototype, continuing up the chain until reaching `Object.prototype` or `null`. This is how JavaScript implements inheritance.

**Q: What's the difference between `prototype` and `__proto__`?**
A: `prototype` is a property that exists only on functions - it's what becomes the prototype of objects created with `new`. `__proto__` exists on all objects and points to the object's actual prototype. `__proto__` is the legacy accessor for the internal `[[Prototype]]` property.

**Q: Why would you use prototype methods instead of instance methods?**
A: Prototype methods are shared across all instances, saving memory. If you create 1000 instances, they all share the same prototype methods instead of each having their own copy. This is more memory-efficient and allows for easier method overriding and inheritance.

**Q: How do you set up inheritance in JavaScript without using classes?**
A: You set up inheritance using `Object.create()` and constructor chaining:
```javascript
function Child() {
  Parent.call(this); // Call parent constructor
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

**Q: What is method chaining and how does it work with prototypes?**
A: Method chaining allows you to call multiple methods on the same object in sequence. It works by having each method return `this` (the current instance). This is commonly used in validation libraries, jQuery, and other fluent APIs. Prototype methods can easily support method chaining since they have access to the instance via `this`.

**Q: What happens when you use `new` with a function?**
A: The `new` operator creates a new empty object, sets its `[[Prototype]]` to the function's `prototype` property, sets `this` to the new object within the function, executes the function, and returns the new object (or the function's return value if it's an object).

**Q: Can arrow functions be used as constructors? Why or why not?**
A: No, arrow functions cannot be used as constructors because they don't have their own `this` context or `prototype` property. Using `new` with an arrow function throws a TypeError.

**Q: How does `bind` work and what are its use cases?**
A: `bind` creates a new function with a permanently bound `this` value and optionally pre-set arguments. It's commonly used for callbacks where you need to preserve context, like in event handlers or setTimeout callbacks.

### Real-World Applications
- Event handlers in React components
- Callback functions in asynchronous operations
- Method borrowing and composition
- Partial function application
- Inheritance patterns in JavaScript
- Context preservation in callback-heavy code