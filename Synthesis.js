import { multiply, transpose } from "mathjs";
import { printMatrix } from "./utils.js";
import { LocalPriorities } from "./LocalPriorities.js";

export class Synthesis {
  constructor(alternatives, criterions, weights) {
    this.alternatives = alternatives;
    this.criterions = criterions;
    this.weights = weights;
  }

  globalPriorities() {
    const alternativeVectors = this.alternatives
      .map((_) =>
        _.map((matrix) => {
          const localPriorities = new LocalPriorities(matrix);
          const { W } = localPriorities.calcMediumGeometric();
          return W;
        })
      )
      .map((matrix) => {
        const m = transpose(matrix);
        printMatrix(m, "Вектори локальних пріоритетів альтернатив:", 3);
        return m;
      });

    const criterionVectors = this.criterions
      .map((matrix) => {
        const localPriorities = new LocalPriorities(matrix);
        const { W } = localPriorities.calcMediumGeometric();
        return transpose(W);
      })
      .map((matrix) => {
        printMatrix(matrix, "Вектори локальних пріоритетів критеріїв:", 3);
        return matrix;
      });

    const W = transpose(
      alternativeVectors.map((matrix, i) => {
        return multiply(matrix, criterionVectors[i]);
      })
    );

    return multiply(W, transpose(this.weights));
  }
}
