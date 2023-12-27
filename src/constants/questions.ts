/**
 * 문제
 * {
 *  정답 위치
 *  선택형 문항의 위치
 * }
 */

interface Selection {
  title: string;
  locX: number;
  locY: number;
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
        locX: 100,
        locY: 200,
      },
      {
        title: 'dog',
        locX: 220,
        locY: 220,
      },
      {
        title: 'octopus',
        locX: 350,
        locY: 220,
      },
      {
        title: 'rabbit',
        locX: 500,
        locY: 220,
      },
      {
        title: 'squirrel',
        locX: 600,
        locY: 220,
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
        locX: 100,
        locY: 200,
      },
      {
        title: 'dog',
        locX: 220,
        locY: 220,
      },
      {
        title: 'octopus',
        locX: 350,
        locY: 220,
      },
      {
        title: 'rabbit',
        locX: 500,
        locY: 220,
      },
      {
        title: 'squirrel',
        locX: 600,
        locY: 220,
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
        locX: 100,
        locY: 200,
      },
      {
        title: 'dog',
        locX: 220,
        locY: 220,
      },
      {
        title: 'octopus',
        locX: 350,
        locY: 220,
      },
      {
        title: 'rabbit',
        locX: 500,
        locY: 220,
      },
      {
        title: 'squirrel',
        locX: 600,
        locY: 220,
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
        locX: 100,
        locY: 200,
      },
      {
        title: 'dog',
        locX: 220,
        locY: 220,
      },
      {
        title: 'octopus',
        locX: 350,
        locY: 220,
      },
      {
        title: 'rabbit',
        locX: 500,
        locY: 220,
      },
      {
        title: 'squirrel',
        locX: 600,
        locY: 220,
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
        locX: 100,
        locY: 200,
      },
      {
        title: 'dog',
        locX: 220,
        locY: 220,
      },
      {
        title: 'octopus',
        locX: 350,
        locY: 220,
      },
      {
        title: 'rabbit',
        locX: 500,
        locY: 220,
      },
      {
        title: 'squirrel',
        locX: 600,
        locY: 220,
      },
    ],
  },
];
