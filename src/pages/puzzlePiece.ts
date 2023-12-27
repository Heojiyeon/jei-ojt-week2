import { fabric } from 'fabric';
import { PuzzleQuestions } from '../constants/questions';
import { push } from '../utils/router';

type PuzzlePieceProp = {
  $app: HTMLElement | null;
};

export default function PuzzlePiecePage({ $app }: PuzzlePieceProp) {
  let currentOrder = 0;

  const $puzzlePieceTitle = document.createElement('div');
  const $puzzlePieceContent = document.createElement('canvas');
  const $puzzlePieceRemaining = document.createElement('div');

  $app?.appendChild($puzzlePieceTitle);
  $app?.appendChild($puzzlePieceContent);
  $app?.appendChild($puzzlePieceRemaining);

  const canvas = new fabric.Canvas($puzzlePieceContent, {
    width: 800,
    height: 500,
    selection: false,
  });

  const createPuzzlePieces = (currentOrder: number) => {
    // 모든 문제를 풀었을 때 결과 페이지로 이동
    if (currentOrder >= PuzzleQuestions.length) {
      push('/result');
      return;
    }

    $puzzlePieceTitle.innerText = `${currentOrder + 1}. ${
      PuzzleQuestions[currentOrder].title
    }를 완성해주세요.`;

    $puzzlePieceRemaining.innerText = `남은 문제 수 : ${
      PuzzleQuestions.length - currentOrder
    }`;

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
            selectable: false,
          });

          canvas.add(img);
        },
        {
          crossOrigin: 'anonymous',
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
  };

  createPuzzlePieces(currentOrder);
}
