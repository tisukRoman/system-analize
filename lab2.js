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

// Вектор вагових коєфіцієнтів
const weights = [0.5, 0.5];

// Ієрархічний синтез
const synthesis = new Synthesis(
  [
    [simplicity, vacancies], // Критерії Можливість знайти роботу
    [popularity, perspective], // Критерії Актуальність мови в майбутньому
  ],
  [work, actuality], // Критерії вищого рівня
  weights // Вектор вагових коєфіцієнтів
);

// Знаходження глобальних пріоритетів
const globalPriorities = synthesis.globalPriorities();

printMatrix(globalPriorities, "Глобальні пріоритети:", 3);
