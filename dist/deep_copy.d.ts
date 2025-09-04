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
declare const obj: Person;
declare const shallowCopy: Person;
declare const deepCopy: Person;
declare const makeDeepCopy: <T extends Record<string, any>>(obj: T) => T;
declare const deepCopy2: Person;
//# sourceMappingURL=deep_copy.d.ts.map