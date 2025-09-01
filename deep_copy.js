const obj = {
  name: "John",
  age: 20,
  city: "New York",
  address: {
    street: "123 Main St",
    zipCode: "10001",
  },
};

// Create copies BEFORE modifying the original
const shallowCopy = { ...obj };
const deepCopy = JSON.parse(JSON.stringify(obj));

const makeDeepCopy = (obj) => {
  // check if the target is a reference type
  if (typeof obj === "object" && obj !== null) {
    // correctly register the target as array or object
    const result = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      // skip inherited properties, so things like __proto__ is not copied
      if (obj.hasOwnProperty(key)) {
        result[key] = makeDeepCopy(obj[key]);
      }
    }
    return result;
  } else {
    return obj;
  }
};
const deepCopy2 = makeDeepCopy(obj);

// Now modify the original object (including nested properties)
obj.city = "Los Angeles";
obj.address.street = "456 Oak Ave";

console.log("Original object:");
console.log(obj);
console.log("Shallow copy (nested objects are still referenced):");
console.log(shallowCopy);
console.log("Deep copy (JSON method):");
console.log(deepCopy);
console.log("Deep copy (custom function):");
console.log(deepCopy2);
