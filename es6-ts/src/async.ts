const dummyData = [
  {
    id: 1,
    user: "elon musk",
    job: "Diablo rank player",
  },
  {
    id: 2,
    user: "donald trump",
    job: "memecoin dumper",
  },
  {
    id: 3,
    user: "sam altman",
    job: "Employer who losts his employees",
  },
];

const fetchData = (url: string) => {
  try {
    console.log(`Fetching data from [${url}]`);
    return new Promise((resolve, reject) => {
      resolve(dummyData);
    });
  } catch (error: unknown) {
    throw new Error("encounter error:" + error);
  }
};

const loadData = async () => {
  try {
    const data = await fetchData("https://jsonplaceholder.typicode.com/posts");
    console.log(data);
  } catch (error: unknown) {
    throw new Error("encounter error:" + error);
  }
};

// const data = fetchData("https://jsonplaceholder.typicode.com/posts");
// data.then((data) => console.log(data));
// console.log(data);
//
loadData();
