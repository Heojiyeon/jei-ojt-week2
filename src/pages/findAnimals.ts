import { fabric } from 'fabric';
import { Questions } from '../constants/questions';

type FindAnimalsPageProp = {
  $app: HTMLElement | null;
};

export default function FindAnimalsPage({ $app }: FindAnimalsPageProp) {
  let currentOrder = 0;

  const $questionTitle = document.createElement('div');
  const $questionContent = document.createElement('canvas');
  const $questionRemaining = document.createElement('div');

  $questionContent.setAttribute('width', '600');
  $questionContent.setAttribute('height', '500');

  const canvas = new fabric.Canvas($questionContent);

  /**
   * canvas image 생성
   */
  Questions.map(question => {
    fabric.Image.fromURL(
      `../../public/images/${question.answer}.png`,

      function (img) {
        const image = img
          .set({ left: question.order * 100, top: 200 })
          .scale(0.15);

        canvas.add(image).renderAll();
      },
      { crossOrigin: 'anonymous' }
    );
  });

  $questionTitle.innerText = `${currentOrder + 1}. ${
    Questions[currentOrder].title
  }를 찾아주세요.`;
  $questionRemaining.innerText = `남은 문제 수 : ${9 - currentOrder}`;

  const render = () => {
    $app?.appendChild($questionTitle);
    $app?.appendChild($questionContent);
    $app?.appendChild($questionRemaining);
  };

  render();
}
