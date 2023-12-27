/**
 * 동물 퍼즐 문제
 */

interface PuzzleSelection {
  answer: string;
  locX: number;
  locY: number;
}
interface PuzzleQuestion {
  order: number;
  title: string;
  answer: string;
  answerLocX: number;
  answerLocY: number;
  selections: PuzzleSelection[];
}

export const PuzzleQuestions: PuzzleQuestion[] = [
  {
    order: 1,
    title: '곰',
    answer: 'bear',
    answerLocX: 150,
    answerLocY: 150,
    selections: [
      {
        answer: 'bear',
        locX: 530,
        locY: 130,
      },
      {
        answer: 'cat',
        locX: 530,
        locY: 180,
      },
      {
        answer: 'octopus',
        locX: 530,
        locY: 320,
      },
      {
        answer: 'rabbit',
        locX: 530,
        locY: 370,
      },
      {
        answer: 'squirrel',
        locX: 530,
        locY: 420,
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
    title: '고양이',
    answerLocX: 270,
    answerLocY: 263,
    selections: [
      {
        title: 'cat',
        isCorrect: true,
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
        title: 'rabbit',
        isCorrect: false,
      },
      {
        title: 'squirrel',
        isCorrect: false,
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
        title: 'cat',
        isCorrect: false,
      },
      {
        title: 'dog',
        isCorrect: true,
      },
      {
        title: 'octopus',
        isCorrect: false,
      },
      {
        title: 'rabbit',
        isCorrect: false,
      },
      {
        title: 'squirrel',
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
        title: 'cat',
        isCorrect: false,
      },
      {
        title: 'dog',
        isCorrect: false,
      },
      {
        title: 'octopus',
        isCorrect: true,
      },
      {
        title: 'rabbit',
        isCorrect: false,
      },
      {
        title: 'squirrel',
        isCorrect: false,
      },
    ],
  },
  {
    order: 4,
    title: '토끼',
    answerLocX: 634,
    answerLocY: 266,
    selections: [
      {
        title: 'cat',
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
        title: 'rabbit',
        isCorrect: true,
      },
      {
        title: 'squirrel',
        isCorrect: false,
      },
    ],
  },
  {
    order: 5,
    title: '다람쥐',
    answerLocX: 747,
    answerLocY: 276,
    selections: [
      {
        title: 'cat',
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
        title: 'rabbit',
        isCorrect: false,
      },
      {
        title: 'squirrel',
        isCorrect: true,
      },
    ],
  },
];
