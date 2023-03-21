import { LocalPriorities } from "./LocalPriorities.js";
import { Synthesis } from "./Synthesis.js";
import { transpose, multiply } from "mathjs";
import { printMatrix } from "./utils.js";

// Матриці попарних порівнянь альтернатив відносно критеріїв найнижчого рівня:

// Розташування значень порівнянь:
//
//         JavaScript, Python, Java, C++
// JavaScript
// Python
// Java
// C++

// Порівняння простоти вивчення
const simplicity = [
  [1, 1 / 3, 1 / 5, 1 / 7],
  [1 / 3, 1, 5, 7],
  [5, 1 / 5, 1, 3],
  [7, 1 / 7, 1 / 3, 1],
];

// Порівняння Перспективності
const perspective = [
  [1, 1, 5, 3],
  [1, 1, 5, 3],
  [1 / 5, 1 / 5, 1, 1 / 3],
  [1 / 3, 1 / 3, 3, 1],
];

// Порівняння Популярності
const popularity = [
  [1, 1, 3, 3],
  [1, 1, 3, 3],
  [1 / 3, 1 / 3, 1, 1],
  [1 / 3, 1 / 3, 1, 1],
];

// Порівняння кількості вакансій
const vacancies = [
  [1, 1 / 3, 1, 3],
  [3, 1, 3, 5],
  [1, 1 / 3, 1, 3],
  [1 / 3, 1 / 5, 1 / 3, 1],
];

// Порівняння критеріїв одного рівня відносно підпорядкованиї критеріїв біль високого рівня

// Можливість знайти роботу
// Вакансії   Складність
// Складність
const work = [
  [1, 3],
  [1 / 3, 1],
];

// Актуальність мови в подальшому
// Перспективність Популярність
// Популярність
const actuality = [
  [1, 3],
  [1 / 3, 1],
];

// Знаходження векторів локальних пріоритетів альтернатив
const actualityAlternativesVectors = transpose(
  [popularity, perspective].map((matrix) => {
    const localPriorities = new LocalPriorities(matrix);
    const { W } = localPriorities.calcMediumGeometric();
    return W;
  })
);

printMatrix(
  actualityAlternativesVectors,
  "Вектори локальних пріоритетів W1, W2",
  3
);

const workAlternativesVectors = transpose(
  [simplicity, vacancies].map((matrix) => {
    const localPriorities = new LocalPriorities(matrix);
    const { W } = localPriorities.calcMediumGeometric();
    return W;
  })
);

printMatrix(workAlternativesVectors, "Вектори локальних пріоритетів W3, W4", 3);

// Знаходження векторів локальних пріоритетів критеріїв
function getLocalPriorityVector(matrix) {
  const lp = new LocalPriorities(matrix);
  const { W } = lp.calcMediumGeometric();
  return transpose(W);
}

const workCriterionVector = getLocalPriorityVector(work);

printMatrix(
  workCriterionVector,
  "Вектор локального пріоритету критерію Роботи",
  3
);

const actualityCriterionVector = getLocalPriorityVector(actuality);

printMatrix(
  actualityCriterionVector,
  "Вектор локального пріоритету критерію Актуальності",
  3
);

// Ієрархічний синтез

const WAt = multiply(actualityAlternativesVectors, actualityCriterionVector);
const WAp = multiply(workAlternativesVectors, workCriterionVector);

printMatrix(WAt, "WAt:", 3);
printMatrix(WAp, "WAp:", 3);

const localPrioritiesVectors = transpose([WAt, WAp]);

const We = transpose([0.25, 0.25]);

printMatrix(localPrioritiesVectors, "Локальні пріоритети:", 3);
printMatrix(We, "We:", 3);

const globalPriorities = multiply(localPrioritiesVectors, We);

printMatrix(globalPriorities, "Глобальні пріоритети:", 3);
