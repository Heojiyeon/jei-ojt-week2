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
  /**
   * 헤더 구현
   */
  const $header = document.querySelector('header');
  $header!.style.marginBottom = '1rem';

  const headerTitle = document.createElement('div');
  headerTitle.setAttribute('id', 'header-title');
  headerTitle.innerText = 'JEI 동물 찾기';

  const headerTitleStyles = {
    fontSize: '1.6rem',
    color: '#ffffff',
    padding: '1rem',
  };
  Object.assign(headerTitle.style, headerTitleStyles);

  $header?.appendChild(headerTitle);

  /**
   * 문제 구성 엘리먼트
   */

  const $questionTitle = document.createElement('div');
  const $questionContent = document.createElement('canvas');
  const $questionRemaining = document.createElement('div');

  $questionContent.setAttribute('width', '800');
  $questionContent.setAttribute('height', '400');

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

  /**
   * 정오답 피드백 컴포넌트 생성
   */
  const createFeedbackBubble = (
    locX: number,
    locY: number,
    isCorrect: boolean
  ) => {
    // 피드백 버블 박스
    const bubbleRect = new fabric.Rect({
      width: 300,
      height: 60,
      fill: isCorrect ? '#DDE2FB' : '#FFCED3',
      originX: 'center',
      originY: 'center',
    });

    // 피드백 버블 문구
    const bubbleText = new fabric.Text(
      isCorrect ? '정답입니다!' : '오답입니다!',
      {
        fontSize: 36,
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

  let currentOrder = 0;

  // 문제 당 도전 횟수
  let challenges = 3;

  const createQuetionTextContent = (currentOrder: number) => {
    $questionTitle.innerHTML = `
      <img src=\'/images/speech.png'\ alt='tts-icon' id='tts-icon' />
      &nbsp;
        ${currentOrder + 1}. ${Questions[currentOrder].title}를 찾아주세요.
        </div>
    </div>
    `;

    $questionTitle.style.fontSize = '24px';
    $questionTitle.style.marginTop = '2rem';

    $questionRemaining.innerText = `남은 문제 수 : ${
      Questions.length - currentOrder - 1
    }`;

    $questionRemaining.style.display = 'flex';
    $questionRemaining.style.justifyContent = 'flex-end';
    $questionRemaining.style.fontSize = '24px';
    $questionRemaining.style.marginRight = '1rem';
  };

  createQuetionTextContent(currentOrder);

  const createQuestions = (currentOrder: number) => {
    // 모든 문제를 풀었을 때 결과 페이지로 이동
    if (currentOrder >= Questions.length) {
      push('/result');
      return;
    }

    /**
     * TTS 기능 구현
     */
    const $ttsIcon = document.querySelector('#tts-icon');

    $ttsIcon?.addEventListener('click', () => {
      const $questionContent =
        document.querySelector('#question-content')?.textContent;

      ttsSpeech($questionContent!);
    });

    // 클릭했던 선택지를 담는 변수
    const selectedQuesionNames: string[] = [];

    Questions[currentOrder].selections.map((question, idx) => {
      fabric.Image.fromURL(
        `/images/findAnimals/${question.title}-1.png`,

        function (img) {
          img
            .set({
              left: 100 + idx * 160,
              top: 130,
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
              img.scale(0.8);

              createFeedbackBubble(250, 300, question.isCorrect);
              setCountOfCorrect();

              setTimeout(() => {
                canvas.clear();
                createQuestions((currentOrder += 1));
                createQuetionTextContent(currentOrder);
                return;
              }, 1000);
            }
            // 오답인 경우
            else {
              if (challenges > 1) {
                challenges -= 1;
                createQuetionTextContent(currentOrder);

                selectedQuesionNames.push(selectedQuestionName!);

                img.set('selectable', false);
                img.set('opacity', 0.5);

                img.selectable = false;

                createFeedbackBubble(250, 300, question.isCorrect);
              } else if (challenges === 1) {
                img.set('selectable', false);
                img.set('opacity', 0.5);

                createQuetionTextContent(currentOrder);
                createFeedbackBubble(250, 300, question.isCorrect);
                setTimeout(() => {
                  canvas.clear();
                  createQuestions((currentOrder += 1));
                }, 1000);
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
