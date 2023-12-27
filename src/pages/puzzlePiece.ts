import { fabric } from 'fabric';
import { PuzzleQuestions } from '../constants/questions';

type PuzzlePieceProp = {
  $app: HTMLElement | null;
};

export default function PuzzlePiecePage({ $app }: PuzzlePieceProp) {
  const $puzzlePieceContent = document.createElement('canvas');

  $puzzlePieceContent.setAttribute(
    'style',
    '{position:absolute; top:100; left:200;}'
  );

  const canvas = new fabric.Canvas($puzzlePieceContent, {
    selection: false,
    targetFindTolerance: 2,
    width: 800,
    height: 500,
  });

  canvas.on('object:moving', e => console.log(e.target, 'moved!'));

  /**
   * 헤더
   */
  const headerRect = new fabric.Rect({
    width: 800,
    height: 35,
    fill: '#E5001A',
  });

  const headerText = new fabric.Text('JEI 동물 퍼즐', {
    fontSize: 15,
    fill: '#FFFFFF',
    top: 10,
    left: 10,
    fontFamily: 'MaplestoryOTFBold',
  });

  const header = new fabric.Group([headerRect, headerText], {
    left: 0,
    top: 0,
  });

  canvas.add(header);

  /**
   * 문제 제목
   */
  const titleText = new fabric.Text('1. 곰을 완성해주세요.', {
    fontSize: 20,
    top: 60,
    left: 30,
    fontFamily: 'MaplestoryOTFBold',
  });
  canvas.add(titleText);

  /**
   * 문제 이미지
   */
  const totalQuestionRect = new fabric.Rect({
    width: 700,
    height: 297,
    fill: '#FFF8F8',
    top: 90,
    left: 50,
  });

  // 문제 wrapper
  const questionRect = new fabric.Rect({
    width: 300,
    height: 260,
    fill: '#FFFFFF',
    top: 110,
    left: 70,
  });

  // 문제 이미지
  PuzzleQuestions.map(puzzleQuestion => {
    // 문제 핵심 이미지
    fabric.Image.fromURL(
      `../../public/images/puzzlePiece/${puzzleQuestion.answer}-cropped.png`,
      function (img) {
        img.set({
          left: 140,
          top: 150,
        });

        canvas.add(img);
      },
      {
        crossOrigin: 'anonymouse',
      }
    );

    // 선택지 이미지
    puzzleQuestion.selections.map((selection, idx) => {
      fabric.Image.fromURL(
        `../../public/images/puzzlePiece/${selection.answer}-answer.png`,
        function (img) {
          img.set({
            left: 530,
            top: 130 + idx * 50,
          });

          img.perPixelTargetFind = true;
          img.hasControls = img.hasBorders = false;

          canvas.add(img);
        },
        {
          crossOrigin: 'anonymous',
        }
      );
    });
  });

  // 선택지 이미지
  const selectionsRect = new fabric.Rect({
    width: 330,
    height: 260,
    fill: '#FFF8F8',
    top: 110,
    left: 400,
  });

  const question = new fabric.Group([questionRect, selectionsRect], {
    left: 70,
    top: 110,
    subTargetCheck: false,
  });

  canvas.add(totalQuestionRect);
  canvas.add(question);

  /**
   * 문제 남은 수
   */
  const remainingText = new fabric.Text(`남은 문제 수 : `, {
    fontSize: 20,
    top: 403,
    left: 640,
    fontFamily: 'MaplestoryOTFBold',
  });
  canvas.add(remainingText);

  const render = () => {
    $app?.appendChild($puzzlePieceContent);
  };

  render();
}
