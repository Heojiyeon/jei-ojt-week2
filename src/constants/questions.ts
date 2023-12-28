/**
 * 동물 퍼즐 문제
 */

interface PuzzleSelection {
  answer: string;
}
interface PuzzleQuestion {
  order: number;
  title: string;
  answer: string;
  selections: PuzzleSelection[];
}

export const PuzzleQuestions: PuzzleQuestion[] = [
  {
    order: 1,
    title: '곰',
    answer: 'bear',
    selections: [
      {
        answer: 'bear',
      },
      {
        answer: 'cat',
      },
      {
        answer: 'octopus',
      },
      {
        answer: 'squirrel',
      },
    ],
  },
  {
    order: 2,
    title: '나비',
    answer: 'butterfly',
    selections: [
      {
        answer: 'octopus',
      },
      {
        answer: 'butterfly',
      },
      {
        answer: 'cat',
      },
      {
        answer: 'kangaroo',
      },
    ],
  },
  {
    order: 3,
    title: '다람쥐',
    answer: 'squirrel',
    selections: [
      {
        answer: 'rabbit',
      },
      {
        answer: 'squirrel',
      },
      {
        answer: 'kangaroo',
      },
      {
        answer: 'cat',
      },
    ],
  },
  {
    order: 4,
    title: '토끼',
    answer: 'rabbit',
    selections: [
      {
        answer: 'octopus',
      },
      {
        answer: 'butterfly',
      },
      {
        answer: 'kangaroo',
      },
      {
        answer: 'rabbit',
      },
    ],
  },
];

/**
 * 동물 찾기 문제
 */

interface Selection {
  title: string;
  isCorrect: boolean;
}

interface Question {
  order: number;
  title: string;
  answerLocX: number;
  answerLocY: number;
  selections: Selection[];
}

export const Questions: Question[] = [
  {
    order: 1,
    title: '캥거루',
    answerLocX: 270,
    answerLocY: 263,
    selections: [
      {
        title: 'bear',
        isCorrect: false,
      },
      {
        title: 'squirrel',
        isCorrect: false,
      },
      {
        title: 'butterfly',
        isCorrect: false,
      },
      {
        title: 'kangaroo',
        isCorrect: true,
      },
    ],
  },
  {
    order: 2,
    title: '강아지',
    answerLocX: 369,
    answerLocY: 272,
    selections: [
      {
        title: 'dog',
        isCorrect: true,
      },
      {
        title: 'octopus',
        isCorrect: false,
      },
      {
        title: 'ant',
        isCorrect: false,
      },
      {
        title: 'bear',
        isCorrect: false,
      },
    ],
  },
  {
    order: 3,
    title: '문어',
    answerLocX: 517,
    answerLocY: 277,
    selections: [
      {
        title: 'squirrel',
        isCorrect: false,
      },
      {
        title: 'crocodile',
        isCorrect: false,
      },
      {
        title: 'octopus',
        isCorrect: true,
      },
      {
        title: 'ant',
        isCorrect: false,
      },
    ],
  },
  {
    order: 4,
    title: '다람쥐',
    answerLocX: 747,
    answerLocY: 276,
    selections: [
      {
        title: 'butterfly',
        isCorrect: false,
      },
      {
        title: 'dog',
        isCorrect: false,
      },
      {
        title: 'octopus',
        isCorrect: false,
      },
      {
        title: 'squirrel',
        isCorrect: true,
      },
    ],
  },
];
