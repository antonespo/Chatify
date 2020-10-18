// This method group by the key, if it is a string 
// all the char must be the same to stay in the same group 
export const groupBy = (items, key) => {
  const result = items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }),
    {},
  );

  let final = [];
  for (let key in result) {
    final.push([key, result[key]])
  }

  return final;
}

// This method group by the key that should be a date in the ISO format
// so the method group by date and clear the time
export const groupByDate = (items, key) => {
  items.map((item) => item[key] = item[key].toISOString().split("T")[0])

  const result = items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }),
    {},
  );

  let final = [];
  for (let key in result) {
    final.push([key, result[key]])
  }

  return final;
}

export const sortArrayByDate = (array) => {
  return array.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}

// // Just for testing
// const myObj = [
//   { Phase: "Phase 1", Step: "Step 1", Value: 15, date: "2020-04-03T12:12:00" },
//   { Phase: "Phase 1", Step: "Step 2", Value: 35, date: "2020-04-03T13:12:00" },
//   { Phase: "Phase 2", Step: "Step 1", Value: 55, date: "2020-04-03T12:12:00" },
//   { Phase: "Phase 2", Step: "Step 2", Value: 75, date: "2020-03-03T12:12:00" }
// ]

// // Example: 
// console.log(groupBy(myObj, "Phase"))
// console.log(groupBy(myObj, "Value"))
// console.log(groupByDate(myObj, "date"))
