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
    canvas.add(bubbleGroup);

    setTimeout(() => {
      canvas.remove(bubbleGroup);
    }, 1000);
  };

  const createQuestions = (currentOrder: number) => {
    // 모든 문제를 풀었을 때 결과 페이지로 이동
    if (currentOrder >= Questions.length) {
      push('/result');
      return;
    }

    $questionTitle.innerHTML = `
    <div id='question-title-container'>
      <img src=\'/images/speech.png'\ alt='tts-icon' id='tts-icon' />
      <div id='question-content'>
        ${currentOrder + 1}. ${Questions[currentOrder].title}를 찾아주세요.
      </div>
    </div>
    `;

    $questionRemaining.innerText = `남은 문제 수 : ${
      Questions.length - currentOrder
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

    // 문제 당 도전 횟수
    let challenges = 3;

    // 클릭했던 선택지를 담는 변수
    const selectedQuesionNames: string[] = [];

    Questions[currentOrder].selections.map((question, idx) => {
      fabric.Image.fromURL(
        `/images/findAnimals/${question.title}-1.png`,

        function (img) {
          img
            .set({
              left: 100 + idx * 160,
              top: 200,
              selectable: false,
              name: question.title,
            })
            .scale(0.6);

          img.on('mousedown', () => {
            const selectedQuestionName = img.get('name');

            //  이전에 클릭했던 이미지 핸들링
            if (
              selectedQuesionNames !== undefined &&
              selectedQuesionNames.findIndex(
                questionName => questionName === selectedQuestionName
              ) !== -1
            ) {
              alert('이미 선택한 이미지에요');
              return;
            }
            // 정답인 경우
            if (question.isCorrect === true) {
              createFeedbackBubble(
                img.get('left')!,
                img.get('top')! - 30,
                question.isCorrect
              );
              setCountOfCorrect();

              setTimeout(() => {
                createQuestions((currentOrder += 1));
                canvas.clear();
                return;
              }, 1000);
            }
            // 오답인 경우
            else {
              if (challenges > 0) {
                challenges -= 1;
                selectedQuesionNames.push(selectedQuestionName!);

                img.set('selectable', false);
                img.set('opacity', 0.5);

                img.selectable = false;

                createFeedbackBubble(
                  img.get('left')!,
                  img.get('top')! - 30,
                  question.isCorrect
                );
              } else if (challenges === 0) {
                canvas.clear();
                createQuestions((currentOrder += 1));
              }
            }
          });

          canvas.add(img);
        },
        { crossOrigin: 'anonymous' }
      );
    });
  };

  createQuestions(currentOrder);
}
