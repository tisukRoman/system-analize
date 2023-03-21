import { round } from "mathjs";

export function printMatrix(matrix, title = "", roundNum = 2) {
  let res;

  if (isMatrix(matrix)) {
    res = matrix.map((row) =>
      row.map((num) => {
        if (typeof num == "string") {
          return num;
        } else {
          return round(num, roundNum);
        }
      })
    );
  } else if (Array.isArray(matrix)) {
    res = matrix.map((num) => {
      if (typeof num == "string") {
        return num;
      } else {
        return round(num, roundNum);
      }
    });
  } else {
    res = round(matrix, roundNum);
  }

  console.log(title);
  console.table(res);
  console.log("");
}

export function isMatrix(array) {
  return Array.isArray(array) && Array.isArray(array[0]);
}

export function printSpace() {
  console.log("");
  console.log("---------------------------------------------");
  console.log("");
}

export function printTitle(title) {
  console.log(title.toUpperCase());
  console.log("");
}
