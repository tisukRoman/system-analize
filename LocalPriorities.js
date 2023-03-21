import {
  transpose,
  multiply,
  pow,
  divide,
  subtract,
  abs,
  prod,
  sum,
  floor,
} from "mathjs";

export class LocalPriorities {
  constructor(matrix) {
    this.matrix = matrix;
    this.n = matrix.length;

    // e транспонована
    this.eT = [Array(this.n).fill(1)];

    // n-мірний одиничний вектор стовпець
    this.e = transpose(this.eT);
  }

  calcIterative(accuracy) {
    let prevWi;
    let W;

    for (let i = 0; i < this.n; i++) {
      // Номер ітеації і степеня
      const k = i + 1;

      // Знаходимо власний вектор ітерації
      const A = pow(this.matrix, k);
      const Ae = multiply(A, this.e);
      const eTAe = multiply(this.eT, Ae);
      const Wi = divide(Ae, eTAe);

      if (prevWi) {
        // знаходимо епсилон
        const eps = multiply(this.eT, abs(subtract(Wi, prevWi)));

        // якщо точність досягнута, то беремо Wi як власний вектор
        if (floor(eps) < accuracy) {
          W = Wi;
        }
      }

      // Зберігаємо значення власного вектора для наст.ітерації
      prevWi = Wi;
    }

    // Макс.власне значення
    const lambdaMax = multiply(this.eT, multiply(this.matrix, W));

    return {
      W,
      lambdaMax,
    };
  }

  calcMediumGeometric() {
    // Середнє геометричне
    const mediumGeo = this.matrix.map((row) => pow(prod(row), 1 / this.n));

    // Вектор відносних пріоритетів
    const W = mediumGeo.map((Wi) => Wi / sum(mediumGeo));

    // Макс.власне значення
    const lambdaMax = multiply(this.eT, multiply(this.matrix, W));

    return {
      W,
      lambdaMax,
    };
  }
}
