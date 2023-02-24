import inquirer from "inquirer";
import { printMatrix, printSpace, printTitle } from "./utils.js";
import { Consistency } from "./Consistency.js";
import { LocalPriorities } from "./LocalPriorities.js";

// Матриця попарних порівнянь
const MATRIX = [
  [1, 5, 3, 1 / 7, 6],
  [1 / 5, 1, 1 / 3, 1, 1 / 3],
  [1 / 3, 3, 1, 6, 3],
  [7, 1, 1 / 6, 1, 1 / 3],
  [1 / 6, 3, 1 / 3, 3, 1],
];

printMatrix(MATRIX, "Ваша матриця попарних порівнянь:");

const localPriorities = new LocalPriorities(MATRIX);
const consistency = new Consistency(MATRIX, 15);

startQuestion();

// questions
async function startQuestion() {
  const answers = await inquirer.prompt({
    name: "start",
    type: "list",
    message: "Що ви бажаєте зробити з матрицею?",
    choices: ["Перевірити узгодженність", "Проранжувати альтернативи"],
  });

  return handleStartQuestion(answers.start);
}

async function consistencyQuestion() {
  const answers = await inquirer.prompt({
    name: "consistency",
    type: "list",
    message: "Яким методом бажаєте знайти найбільш неузгоджену оцінку?",
    choices: [
      "Послідовним вилученням альтернатив",
      "Розрахунком кореляції між рядками та стовпчиками",
    ],
  });

  return handleConsistencyQuestion(answers.consistency);
}

async function localPrioritiesQuestion() {
  const answers = await inquirer.prompt({
    name: "localPriorities",
    type: "list",
    message: "Яким методом бажаєте проранжувати елементи?",
    choices: ["Ітеративним методом", "Методом середнього геометричного"],
  });

  return handleLocalPrioritiesQuestion(answers.localPriorities);
}

// handlers
async function handleStartQuestion(answer) {
  if (answer == "Перевірити узгодженність") {
    printSpace();
    printTitle("Перевірка узгодженності");
    consistency.checkConsistency();

    if (consistency.isConsistent()) {
      await localPrioritiesQuestion();
    } else {
      await consistencyQuestion();
    }
  } else {
    await localPrioritiesQuestion();
  }
}

async function handleConsistencyQuestion(answer) {
  if (answer == "Послідовним вилученням альтернатив") {
    printSpace();
    printTitle("Метод вилучення альтернатив");
    consistency.alternativesExclusion();
    await startQuestion();
  } else {
    printSpace();
    printTitle("Розрахунок Корреляцій");
    consistency.calcCorrelation();
    await startQuestion();
  }
}

async function handleLocalPrioritiesQuestion(answer) {
  if (answer == "Ітеративним методом") {
    printSpace();
    printTitle("Ітераційний метод");
    localPriorities.calcIterative(0.01);
    await startQuestion();
  } else {
    printSpace();
    printTitle("Метод середнього геометричного");
    localPriorities.calcMediumGeometric();
    await startQuestion();
  }
}
