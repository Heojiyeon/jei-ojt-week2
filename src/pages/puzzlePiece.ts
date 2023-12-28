import { fabric } from 'fabric';
import { PuzzleQuestions } from '../constants/questions';
import { push } from '../utils/router';

type PuzzlePieceProp = {
  $app: HTMLElement | null;
  setCountOfCorrect: () => void;
};

export default function PuzzlePiecePage({
  $app,
  setCountOfCorrect,
}: PuzzlePieceProp) {
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

  /**
   * 드래그앤드랍 기능
   */
  canvas.on('object:modified', options => {
    onChange(options);
  });

  /**
   * 선택된 이미지의 위치를 저장하는 변수
   */
  let selectedObjLocX: number | undefined;
  let selectedObjLocY: number | undefined;

  /**
   * canvas 내 object가 수정될 때 실행되는 함수
   */
  function onChange(options: fabric.IEvent<MouseEvent>) {
    options.target!.setCoords();

    canvas.forEachObject(function (obj) {
      if (obj === options.target) return;

      if (options.target!.intersectsWithObject(obj)) {
        // 정답인 경우
        if (options.target!.get('name') === obj.get('name')) {
          setCountOfCorrect();
          createPuzzlePieces((currentOrder += 1));
        }
        // 오답인 경우
        else {
          if (selectedObjLocX !== undefined && selectedObjLocY !== undefined) {
            options.target?.animate('left', selectedObjLocX, {
              onChange: canvas.renderAll.bind(canvas),
            });
            options.target?.animate('top', selectedObjLocY, {
              onChange: canvas.renderAll.bind(canvas),
            });
          }
          selectedObjLocX = undefined;
          selectedObjLocY = undefined;
        }
      }
    });
  }

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

    // 문제 이미지
    PuzzleQuestions.map(puzzleQuestion => {
      // 문제 핵심 이미지
      fabric.Image.fromURL(
        `../../images/puzzlePiece/${puzzleQuestion.answer}-cropped.png`,
        function (img) {
          img.set({
            left: 140,
            top: 150,
            selectable: false,
            name: puzzleQuestion.answer,
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
          `../../images/puzzlePiece/${selection.answer}-answer.png`,
          function (img) {
            img.set({
              left: 530,
              top: 130 + idx * 50,
              name: selection.answer,
            });

            img.on('mousedown', () => {
              selectedObjLocX = img.get('left')!;
              selectedObjLocY = img.get('top')!;
            });

            canvas.add(img);
          },
          {
            crossOrigin: 'anonymous',
          }
        );
      });
    });
  };

  createPuzzlePieces(currentOrder);
}
