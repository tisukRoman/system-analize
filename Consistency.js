import { transpose, pow, min, sum, prod } from "mathjs";
import calculateCorrelation from "calculate-correlation";
import { printMatrix } from "./utils.js";

export class Consistency {
  constructor(matrix, accuracy) {
    this.matrix = matrix;
    this.accuracy = accuracy;
    this.n = matrix.length;
  }

  // Перевірка узгодженності
  checkConsistency() {
    const consistencyRelation = this.#getConsistencyRelation();

    printMatrix(consistencyRelation, "Відношення узгодженності:", 1);

    if (consistencyRelation < this.accuracy) {
      console.log("Матриця узгоджена :)");
      console.log("");
    } else {
      console.log("Матриця не узгоджена :/");
      console.log("");
    }
  }

  // Метод вилучення альтернатив
  alternativesExclusion() {
    if (this.isConsistent()) {
      console.log("Немає необхідності у вилученні альтернатив");
      console.log("");
      return;
    }

    const consistencyIndexes = Array(this.n)
      .fill(0)
      .map((_, i) => {
        const matrix = this.matrix
          .map((row, index) => {
            if (index != i) {
              return row.filter((_, index) => index != i);
            }
          })
          .filter((row) => row);

        return this.#getConsistencyIndex(matrix);
      });

    // Знаходження мінімальних індексів
    const minIndexes = [];

    minIndexes.push(
      consistencyIndexes.findIndex((x) => x == min(consistencyIndexes))
    );

    minIndexes.push(
      consistencyIndexes.findIndex(
        (x) =>
          x ==
          min(consistencyIndexes.filter((x) => x != min(consistencyIndexes)))
      )
    );

    printMatrix(consistencyIndexes, "Індекси узгодженності:", 3);

    console.log(
      `Треба переглянути оцінку A[${minIndexes[0]}][${minIndexes[1]}] і симетричну їй A[${minIndexes[1]}][${minIndexes[0]}]`
    );
    console.log("");
  }

  // Метод розрахунку кореляцій
  calcCorrelation() {
    if (this.isConsistent()) {
      console.log("Немає необхідності у розрахунку кореляцій");
      console.log("");
      return;
    }

    // Коєфіцієнти кореляції по рядкам
    const rowCoeffs = this.matrix.map((row, i) => {
      return row.map((_, j) => {
        if (j != i) {
          return calculateCorrelation(row, this.matrix[j]);
        } else {
          return 0;
        }
      });
    });

    // Матем.сподівання по рядках
    const rowMathExpectations = rowCoeffs.map(
      (row) => sum(row) / (row.length - 1)
    );

    printMatrix(rowMathExpectations, "Матем.сподівання по рядках", 2);

    // Коєфіцієнти кореляції по стовпцях
    const transposedMatrix = transpose(this.matrix);

    const colCoeffs = transposedMatrix.map((row, i) => {
      return row.map((_, j) => {
        if (j != i) {
          return calculateCorrelation(row, transposedMatrix[j]);
        } else {
          return 0;
        }
      });
    });

    // Матем.сподівання по стовпцях
    const colMathExpectations = colCoeffs.map(
      (row) => sum(row) / (row.length - 1)
    );

    printMatrix(colMathExpectations, "Матем.сподівання по стовпцях", 2);

    const minRowIndex = rowMathExpectations.findIndex(
      (x) => x == min(rowMathExpectations)
    );
    const minColIndex = colMathExpectations.findIndex(
      (x) => x == min(colMathExpectations)
    );

    console.log(
      `Отже, викидом є елемент A[${minRowIndex}][${minColIndex}] та симетричний A[${minColIndex}][${minRowIndex}]`
    );
    console.log("");
  }

  isConsistent() {
    return this.#getConsistencyRelation() < this.accuracy;
  }

  #getConsistencyRelation() {
    // Індекс узгодженності
    const consistencyIndex = this.#getConsistencyIndex(this.matrix);

    // Індекс узгодженності випадкової матриці n - виміру
    const mathExpectation = this.#mathExpectation(this.n);

    // Відношення узгодженності
    return (consistencyIndex / mathExpectation) * 100;
  }

  #getConsistencyIndex(matrix) {
    // Розмірність матриці
    const n = matrix.length;

    // сума елементів по стовпцях
    const columnSum = transpose(matrix).map((row) => sum(row));

    // Середнє геометричне
    const mediumGeometric = matrix.map((row) => pow(prod(row), 1 / n));

    // Вектор власних векторів
    const W = mediumGeometric.map((Wi) => Wi / sum(mediumGeometric));

    // Макс.власне значення
    let lambdaMax = 0;

    for (let i = 0; i < n; i++) {
      lambdaMax += W[i] * columnSum[i];
    }

    // Індекс узгодженності
    return (lambdaMax - n) / (n - 1);
  }

  // Індекс узгодженості для випадкових матриць розміру n
  #mathExpectation(n) {
    return {
      1: 0,
      2: 0,
      3: 0.58,
      4: 0.9,
      5: 1.12,
      6: 1.24,
      7: 1.34,
      8: 1.41,
      9: 1.45,
      10: 1.49,
      11: 1.51,
      12: 1.48,
      13: 1.56,
      17: 1.57,
      15: 1.59,
    }[n];
  }
}
