import { fabric } from 'fabric';
import { Questions } from '../constants/questions';
import { push } from '../utils/router';

type FindAnimalsPageProp = {
  $app: HTMLElement | null;
};

export default function FindAnimalsPage({ $app }: FindAnimalsPageProp) {
  let currentOrder = 0;

  const $questionTitle = document.createElement('div');
  const $questionContent = document.createElement('canvas');
  const $questionRemaining = document.createElement('div');

  $questionContent.setAttribute('width', '800');
  $questionContent.setAttribute('height', '500');

  /**
   * canvas image 생성
   * canvas 내부에 생성된 요소에는 직접적인 접근 불가
   * 정답 이미지의 위치를 통해 해당 요소가 클릭되었는 지 여부를 확인
   *
   */
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
    $questionRemaining.innerText = `남은 문제 수 : ${9 - currentOrder}`;

    Questions[currentOrder].selections.map(question => {
      fabric.Image.fromURL(
        `../../public/images/${question.title}.png`,

        function (img) {
          const image = img
            .set({ left: question.locX, top: question.locY })
            .scale(0.15);

          canvas.add(image).renderAll();
        },
        { crossOrigin: 'anonymous' }
      );
    });
  };

  createQuestions(currentOrder);

  $questionContent.addEventListener('click', e => {
    const { answerLocX, answerLocY } = Questions[currentOrder];
    const { pageX, pageY } = e;
    console.log(answerLocX, answerLocY, pageX, pageY);

    // 정/오답에 대한 피드백
    if (
      pageX > answerLocX - 40 &&
      pageX < answerLocX + 40 &&
      pageY > answerLocY - 50 &&
      pageY < answerLocY + 50
    ) {
      console.log('정답입니다!');
      createQuestions((currentOrder += 1));
    } else {
      console.log('오답입니다');
    }
  });

  const render = () => {
    $app?.appendChild($questionTitle);
    $app?.appendChild($questionContent);
    $app?.appendChild($questionRemaining);
  };

  render();
}
