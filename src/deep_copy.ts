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

const obj: Person = {
  name: "John",
  age: 20,
  city: "New York",
  address: {
    street: "123 Main St",
    zipCode: "10001",
  },
};

const shallowCopy: Person = { ...obj };
const deepCopy: Person = JSON.parse(JSON.stringify(obj));

const makeDeepCopy = <T extends Record<string, any>>(obj: T): T => {
  if (typeof obj === "object" && obj !== null) {
    const result = Array.isArray(obj) ? [] as any : {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = makeDeepCopy(obj[key]);
      }
    }
    return result as T;
  } else {
    return obj as T;
  }
};

const deepCopy2: Person = makeDeepCopy(obj);

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