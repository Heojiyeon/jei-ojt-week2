import { fabric } from 'fabric';
import { PuzzleQuestions } from '../constants/questions';
import { push } from '../utils/router';
import Header from '../components/common/Header';
import { ttsSpeech } from '../utils/tts';
import FeedbackBubble from '../components/common/FeedbackBubble';

type PuzzlePieceProp = {
  $app: HTMLElement | null;
  setCountOfCorrect: () => void;
};

export default function PuzzlePiecePage({
  $app,
  setCountOfCorrect,
}: PuzzlePieceProp) {
  /**
   * 헤더 구현
   */
  const $header = document.querySelector('header');
  const header = new Header({
    isMain: false,
    headerContent: '동물 퍼즐',
  }).render();

  $header!.appendChild(header);

  /**
   * 문제 구성 엘리먼트
   */
  let currentOrder = 0;

  const $puzzlePieceTitle = document.createElement('div');
  const $puzzlePieceContent = document.createElement('canvas');
  const $puzzlePieceRemaining = document.createElement('div');

  $puzzlePieceTitle.setAttribute('id', 'puzzle-piece-title');
  $puzzlePieceContent.setAttribute('width', '800');
  $puzzlePieceContent.setAttribute('height', '400');

  $app?.appendChild($puzzlePieceTitle);
  $app?.appendChild($puzzlePieceContent);
  $app?.appendChild($puzzlePieceRemaining);

  const canvas = new fabric.Canvas($puzzlePieceContent, {
    selection: false,
  });

  canvas.hoverCursor = 'pointer';

  /**
   * TTS 함수
   */
  let voices: SpeechSynthesisVoice[];

  function setVoiceList() {
    voices = window.speechSynthesis.getVoices();
  }

  setVoiceList();

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setVoiceList;
  }

  /**
   * 드래그앤드랍 기능
   */
  canvas.on('object:modified', options => {
    onChange(options);
  });

  /**
   * 정답 이미지 컴포넌트 생성
   */
  const createCorrectImage = (answer: string) => {
    const correctImageRect = new fabric.Rect({
      width: 300,
      height: 300,
      fill: '#ffffff',
    });

    fabric.Image.fromURL(`/images/findAnimals/${answer}-1.png`, function (img) {
      img.scale(1.2);

      const correctImageGroup = new fabric.Group([correctImageRect, img], {
        top: 100,
        left: 130,
      });

      canvas.add(correctImageGroup);
    });
  };

  /**
   *  정오답 피드백 컴포넌트 생성 함수
   */
  const createFeedbackBubble = (
    locX: number,
    locY: number,
    isCorrect: boolean
  ) => {
    const feedbackBubble = new FeedbackBubble({
      used: 'puzzlePiece',
      locX,
      locY,
      isCorrect,
    }).render();

    setTimeout(() => {
      canvas.add(feedbackBubble);
    }, 500);

    setTimeout(() => {
      canvas.remove(feedbackBubble);
    }, 1000);
  };

  /**
   * 선택된 이미지의 위치를 저장하는 변수
   */
  let selectedObjLocX: number | undefined;
  let selectedObjLocY: number | undefined;

  /**
   * canvas 내 object가 수정될 때 실행되는 함수
   */
  let isCorrect: boolean | undefined;

  // 문제 당 도전 횟수
  let challenges = 3;

  function onChange(options: fabric.IEvent<MouseEvent>) {
    options.target!.setCoords();

    canvas.forEachObject(function (obj) {
      if (obj === options.target) return;

      if (options.target!.intersectsWithObject(obj)) {
        // 정답인 경우
        if (options.target!.get('name') === obj.get('name')) {
          setCountOfCorrect();
          isCorrect = true;
          createFeedbackBubble(160, 350, true);

          createCorrectImage(options.target!.get('name')!);

          options.target!.opacity = 0;

          setTimeout(() => {
            canvas.clear();
            createPuzzlePieces((currentOrder += 1));
            isCorrect = undefined;
          }, 1000);
        }
        // 오답인 경우
        else {
          if (challenges > 1) {
            challenges -= 1;
            if (
              selectedObjLocX !== undefined &&
              selectedObjLocY !== undefined
            ) {
              options.target?.animate('left', selectedObjLocX, {
                onChange: canvas.renderAll.bind(canvas),
              });
              options.target?.animate('top', selectedObjLocY, {
                onChange: canvas.renderAll.bind(canvas),
              });
              createFeedbackBubble(
                selectedObjLocX + 150,
                selectedObjLocY,
                false
              );
              options.target!.selectable = false;
              options.target!.opacity = 0.5;
            }
            setTimeout(() => {
              selectedObjLocX = undefined;
              selectedObjLocY = undefined;
            }, 1000);
          } else if (challenges === 1) {
            if (
              selectedObjLocX !== undefined &&
              selectedObjLocY !== undefined
            ) {
              options.target?.animate('left', selectedObjLocX, {
                onChange: canvas.renderAll.bind(canvas),
              });
              options.target?.animate('top', selectedObjLocY, {
                onChange: canvas.renderAll.bind(canvas),
              });
              createFeedbackBubble(
                selectedObjLocX + 150,
                selectedObjLocY,
                false
              );
              isCorrect = undefined;
            }
            options.target!.selectable = false;
            options.target!.opacity = 0.5;

            setTimeout(() => {
              canvas.clear();
              createPuzzlePieces((currentOrder += 1));

              isCorrect = undefined;
              selectedObjLocX = undefined;
              selectedObjLocY = undefined;
            }, 1000);
          }
        }
      } else {
        isCorrect = false;
      }

      // 올바르지 않은 경로로 이동했을 경우
      if (isCorrect === false) {
        options.target?.animate('left', selectedObjLocX!, {
          onChange: canvas.renderAll.bind(canvas),
        });
        options.target?.animate('top', selectedObjLocY!, {
          onChange: canvas.renderAll.bind(canvas),
        });
      }
    });
  }

  const createPuzzlePieces = (currentOrder: number) => {
    // 모든 문제를 풀었을 때 결과 페이지로 이동
    if (currentOrder >= PuzzleQuestions.length) {
      push('/result');
      return;
    }

    $puzzlePieceTitle.innerHTML = `
      <img src=\'/images/speech.png'\ alt='tts-icon' id='tts-icon' />
      &nbsp;
        ${currentOrder + 1}. ${
          PuzzleQuestions[currentOrder].title
        }을 완성해주세요.
    `;

    $puzzlePieceTitle.style.fontSize = '24px';
    $puzzlePieceTitle.style.marginTop = '2rem';

    $puzzlePieceRemaining.innerText = `남은 문제 수 : ${
      PuzzleQuestions.length - currentOrder
    }`;

    $puzzlePieceRemaining.style.display = 'flex';
    $puzzlePieceRemaining.style.justifyContent = 'flex-end';
    $puzzlePieceRemaining.style.fontSize = '24px';
    $puzzlePieceRemaining.style.marginRight = '1rem';

    /**
     * TTS 기능 구현
     */
    const $ttsIcon = document.querySelector('#tts-icon');

    $ttsIcon?.addEventListener('click', () => {
      const $puzzlePieceTitle = document.querySelector('#puzzle-piece-title');

      ttsSpeech(voices, $puzzlePieceTitle!.textContent!);
    });

    // 문제 이미지
    // 문제 핵심 이미지
    fabric.Image.fromURL(
      `/images/puzzlePiece/${PuzzleQuestions[currentOrder].answer}-cropped.png`,
      function (img) {
        img.set({
          left: 140,
          top: 100,
          selectable: false,
          name: PuzzleQuestions[currentOrder].answer,
        });

        canvas.add(img);
      },
      {
        crossOrigin: 'anonymous',
      }
    );

    // 선택지 이미지
    PuzzleQuestions[currentOrder].selections.map((selection, idx) => {
      fabric.Image.fromURL(
        `/images/puzzlePiece/${selection.answer}-answer.png`,
        function (img) {
          img
            .set({
              width: 150,
              left: 450,
              top: 70 + idx * 80,
              stroke: '#d4d4d4',
              strokeWidth: 1,
              name: selection.answer,
              hasControls: false,
              hasBorders: false,
            })
            .scale(0.9);

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
  };

  createPuzzlePieces(currentOrder);
}
