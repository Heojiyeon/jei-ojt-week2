import { fabric } from 'fabric';
import { Questions } from '../constants/questions';
import { push } from '../utils/router';

type FindAnimalsPageProp = {
  $app: HTMLElement | null;
  setCountOfCorrect: () => void;
};

export default function FindAnimalsPage({
  $app,
  setCountOfCorrect,
}: FindAnimalsPageProp) {
  let currentOrder = 0;

  const $questionTitle = document.createElement('div');
  const $questionContent = document.createElement('canvas');
  const $questionRemaining = document.createElement('div');

  $questionContent.setAttribute('width', '800');
  $questionContent.setAttribute('height', '500');

  $app?.appendChild($questionTitle);
  $app?.appendChild($questionContent);
  $app?.appendChild($questionRemaining);

  const canvas = new fabric.Canvas($questionContent);

  const createQuestions = (currentOrder: number) => {
    // 모든 문제를 풀었을 때 결과 페이지로 이동
    if (currentOrder >= Questions.length) {
      push('/result');
      return;
    }

    $questionTitle.innerText = `${currentOrder + 1}. ${
      Questions[currentOrder].title
    }를 찾아주세요.`;

    $questionRemaining.innerText = `남은 문제 수 : ${
      Questions.length - currentOrder
    }`;

    Questions[currentOrder].selections.map((question, idx) => {
      fabric.Image.fromURL(
        `../../public/images/findAnimals/${question.title}.png`,

        function (img) {
          img.set({ left: 100 + idx * 100, top: 220 }).scale(0.15);

          img.on('mousedown', () => {
            if (question.isCorrect) {
              setCountOfCorrect();
            }
            setTimeout(() => {
              createQuestions((currentOrder += 1));
              return;
            }, 1000);
          });

          canvas.add(img);
        },
        { crossOrigin: 'anonymous' }
      );
    });
  };

  createQuestions(currentOrder);
}
