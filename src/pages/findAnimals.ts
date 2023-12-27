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
    $questionRemaining.innerText = `남은 문제 수 : ${
      Questions.length - currentOrder
    }`;

    Questions[currentOrder].selections.map(question => {
      fabric.Image.fromURL(
        `../../public/images/findAnimals/${question.title}.png`,

        function (img) {
          console.log(img.toObject());
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

    // 정/오답에 대한 피드백
    if (
      pageX > answerLocX - 40 &&
      pageX < answerLocX + 40 &&
      pageY > answerLocY - 50 &&
      pageY < answerLocY + 50
    ) {
      setCountOfCorrect();

      const feedbackRect = new fabric.Rect({
        width: 120,
        height: 35,
        originX: 'center',
        originY: 'center',
        fill: '#DDE2FB',
      });

      const feedbackText = new fabric.Text('정답입니다', {
        fontSize: 15,
        originX: 'center',
        originY: 'center',
      });

      const feedbackBubble = new fabric.Group([feedbackRect, feedbackText], {
        left: answerLocX - 180,
        top: answerLocY - 90,
      });

      canvas.add(feedbackBubble);
      canvas.setActiveObject(feedbackBubble);

      setTimeout(() => {
        canvas.remove(canvas.getActiveObject()!);
        createQuestions((currentOrder += 1));
        return;
      }, 1000);
    } else {
      const feedbackRect = new fabric.Rect({
        width: 120,
        height: 35,
        originX: 'center',
        originY: 'center',
        fill: '#FFCED3',
      });

      const feedbackText = new fabric.Text('오답입니다', {
        fontSize: 15,
        originX: 'center',
        originY: 'center',
      });

      const feedbackBubble = new fabric.Group([feedbackRect, feedbackText], {
        left: pageX - 190,
        top: pageY - 85,
      });

      canvas.add(feedbackBubble);
      canvas.setActiveObject(feedbackBubble);

      setTimeout(() => {
        canvas.remove(canvas.getActiveObject()!);
        createQuestions((currentOrder += 1));
        return;
      }, 1000);
    }
  });

  const render = () => {
    $app?.appendChild($questionTitle);
    $app?.appendChild($questionContent);
    $app?.appendChild($questionRemaining);
  };

  render();
}
