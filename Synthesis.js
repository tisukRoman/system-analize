import { multiply } from "mathjs";
import { printMatrix } from "./utils.js";

export class Synthesis {
  constructor(matrix, weights) {
    this.matrix = matrix;
    this.weights = weights;
  }

  globalPriorities() {
    const res = multiply(this.matrix, this.weights);

    printMatrix(this.matrix, "Матриця");
    printMatrix(this.weights, "Ваги Критеріїв:");
    printMatrix(res, "Вектор глобальних пріоритетів:");
  }
}
