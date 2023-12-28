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

  const ttsSpeech = (text: string) => {
    if (!window.speechSynthesis) {
      alert(
        '음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요'
      );
      return;
    }
    const lang = 'ko-KR';
    const utterThis = new SpeechSynthesisUtterance(text);

    utterThis.onerror = function (event) {
      console.log('error', event);
    };

    let voiceFound = false;

    for (let i = 0; i < voices.length; i++) {
      if (
        voices[i].lang.indexOf(lang) >= 0 ||
        voices[i].lang.indexOf(lang.replace('-', '_')) >= 0
      ) {
        utterThis.voice = voices[i];
        voiceFound = true;
      }
    }
    if (!voiceFound) {
      alert('voice not found');
      return;
    }
    utterThis.lang = lang;
    utterThis.pitch = 1;
    utterThis.rate = 1;
    window.speechSynthesis.speak(utterThis);
  };

  /**
   * 드래그앤드랍 기능
   */
  canvas.on('object:modified', options => {
    onChange(options);
  });

  // 정오답 피드백 컴포넌트 생성 함수
  const createFeedbackBubble = (
    locX: number,
    locY: number,
    isCorrect: boolean
  ) => {
    // 피드백 버블 박스
    const bubbleRect = new fabric.Rect({
      width: 100,
      height: 35,
      fill: isCorrect ? '#DDE2FB' : '#FFCED3',
      originX: 'center',
      originY: 'center',
    });

    // 피드백 버블 문구
    const bubbleText = new fabric.Text(
      isCorrect ? '정답입니다!' : '오답입니다!',
      {
        fontSize: 15,
        fill: isCorrect ? '#0000FF' : '#E5001A',
        fontFamily: 'MaplestoryOTFBold',
        originX: 'center',
        originY: 'center',
      }
    );

    const bubbleGroup = new fabric.Group([bubbleRect, bubbleText], {
      top: locY,
      left: locX,
    });

    setTimeout(() => {
      canvas.add(bubbleGroup);
    }, 500);

    setTimeout(() => {
      canvas.remove(bubbleGroup);
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
  function onChange(options: fabric.IEvent<MouseEvent>) {
    options.target!.setCoords();

    canvas.forEachObject(function (obj) {
      if (obj === options.target) return;

      if (options.target!.intersectsWithObject(obj)) {
        // 정답인 경우
        if (options.target!.get('name') === obj.get('name')) {
          setCountOfCorrect();
          setTimeout(() => {
            createPuzzlePieces((currentOrder += 1));
          }, 1000);
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
            createFeedbackBubble(selectedObjLocX + 150, selectedObjLocY, false);
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

    $puzzlePieceTitle.innerHTML = `
    <div id='question-title-container'>
      <img src=\'/images/speech.png'\ alt='tts-icon' id='tts-icon' />
      <div id='question-content'>
        ${currentOrder + 1}. ${
          PuzzleQuestions[currentOrder].title
        }를 찾아주세요.
      </div>
    </div>
    `;

    $puzzlePieceRemaining.innerText = `남은 문제 수 : ${
      PuzzleQuestions.length - currentOrder
    }`;

    /**
     * TTS 기능 구현
     */
    const $ttsIcon = document.querySelector('#tts-icon');

    $ttsIcon?.addEventListener('click', () => {
      const $questionContent =
        document.querySelector('#question-content')?.textContent;

      ttsSpeech($questionContent!);
    });

    // 문제 이미지
    PuzzleQuestions.map(puzzleQuestion => {
      // 문제 핵심 이미지
      fabric.Image.fromURL(
        `/images/puzzlePiece/${puzzleQuestion.answer}-cropped.png`,
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
          `/images/puzzlePiece/${selection.answer}-answer.png`,
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
