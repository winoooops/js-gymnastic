"use strict";
const obj = {
    name: "John",
    age: 20,
    city: "New York",
    address: {
        street: "123 Main St",
        zipCode: "10001",
    },
};
const shallowCopy = Object.assign({}, obj);
const deepCopy = JSON.parse(JSON.stringify(obj));
const makeDeepCopy = (obj) => {
    if (typeof obj === "object" && obj !== null) {
        const result = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = makeDeepCopy(obj[key]);
            }
        }
        return result;
    }
    else {
        return obj;
    }
};
const deepCopy2 = makeDeepCopy(obj);
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
//# sourceMappingURL=deep_copy.js.map