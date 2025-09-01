interface Person {
  name: string;
  age: number;
}

function sum(a: number, b: number): number {
  return a + b;
}

function greet(person: Person) {
  console.log(`May the force be with you, ${person.name}`);
}

greet({ name: "John", age: 20 });