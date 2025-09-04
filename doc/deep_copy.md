# Deep Copy Implementation

This file demonstrates different approaches to creating deep copies of objects in TypeScript, comparing various methods and their trade-offs.

## How It Works Under the Hood

### What is Deep Copy?
Deep copy creates a new object that is a complete duplicate of the original, including all nested objects. Unlike shallow copy, deep copy ensures that modifications to the copied object don't affect the original object.

### Shallow Copy (Spread Operator)
```typescript
const shallowCopy = { ...obj };
```
- Only copies top-level properties
- Nested objects are still referenced
- Fast but not suitable for complex objects

### JSON Method
```typescript
const deepCopy = JSON.parse(JSON.stringify(obj));
```
- Creates a true deep copy
- Simple and built-in
- Limitations: Loses functions, undefined values, and circular references

### Recursive Custom Function
The recursive approach traverses the entire object structure:
- Checks if the target is a reference type
- Correctly registers the target as array or object
- Uses `hasOwnProperty` to skip inherited properties
- Recursively copies each nested property

## Usage Example

```typescript
const obj: Person = {
  name: "John",
  age: 20,
  city: "New York",
  address: {
    street: "123 Main St",
    zipCode: "10001",
  },
};

const deepCopy = makeDeepCopy(obj);
obj.city = "Los Angeles"; // Doesn't affect deepCopy
obj.address.street = "456 Oak Ave"; // Doesn't affect deepCopy
```

## Key Implementation Details

### TypeScript Interfaces
```typescript
interface Address {
  street: string;
  zipCode: string;
}

interface Person {
  name: string;
  age: number;
  city: string;
  address: Address;
}
```

### Recursive Deep Copy Function
- Uses TypeScript generics for type safety
- Handles both arrays and objects
- Preserves object structure and types
- Avoids prototype chain pollution

### Type Safety
- Generic type parameter `<T extends Record<string, any>>`
- Maintains original object type
- Compiler-time type checking

## Interview-Ready Concepts

### Key Terms to Remember
- **Deep Copy**: Complete duplication including nested objects
- **Shallow Copy**: Only top-level properties copied
- **Reference Type**: Objects that are stored by reference
- **Recursive**: Function that calls itself
- **TypeScript Generics**: `<T>` for type-safe functions
- **hasOwnProperty**: Check for own properties vs inherited

### Common Interview Questions & Answers

**Q: What's the difference between shallow copy and deep copy?**
A: Shallow copy only copies top-level properties, while nested objects are still referenced by both original and copy. Deep copy creates completely independent duplicates of all nested objects.

**Q: Why would you choose a recursive deep copy over JSON.parse(JSON.stringify())?**
A: The recursive approach preserves functions, undefined values, and circular references, while the JSON method loses these data types. The recursive method also gives you more control over the copying process.

**Q: How does the recursive deep copy function handle different data types?**
A: It checks if the value is an object and not null, then determines if it's an array or object, and recursively copies each property. Primitive values are returned as-is.

**Q: What are the performance implications of deep copying?**
A: Deep copying is more expensive than shallow copy as it needs to traverse the entire object structure. For very large objects, this can impact performance. Shallow copy is O(1) while deep copy is O(n) where n is the total number of properties.

**Q: How do you handle circular references in deep copy?**
A: You need to track visited objects using a Map or WeakMap to avoid infinite loops. When you encounter an object you've already copied, return the existing copy instead of recursing.

### Real-World Applications
- Immutable state management (Redux, Zustand)
- Data transformation pipelines
- API response manipulation
- Caching and memoization
- Object cloning for comparison