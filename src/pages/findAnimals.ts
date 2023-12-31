import { fabric } from 'fabric';
import FeedbackBubble from '../components/common/FeedbackBubble';
import Header from '../components/common/Header';
import { Questions } from '../constants/questions';
import { push } from '../utils/router';
import { ttsSpeech } from '../utils/tts';

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
  const header = new Header({
    isMain: false,
    headerContent: '동물 찾기',
  }).render();

  $header!.appendChild(header);

  /**
   * 문제 구성 엘리먼트
   */
  let currentOrder = 0;

  const $questionTitle = document.createElement('div');
  const $questionContent = document.createElement('canvas');
  const $questionRemaining = document.createElement('div');

  $questionTitle.setAttribute('id', 'question-title');
  $questionContent.setAttribute('width', '800');
  $questionContent.setAttribute('height', '400');

  $app?.appendChild($questionTitle);
  $app?.appendChild($questionContent);
  $app?.appendChild($questionRemaining);

  const canvas = new fabric.Canvas($questionContent, {
    selection: false,
    moveCursor: 'pointer',
    hoverCursor: 'pointer',
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

  /**
   * 정오답 피드백 컴포넌트 생성 함수
   */
  const createFeedbackBubble = (
    locX: number,
    locY: number,
    isCorrect: boolean
  ) => {
    const feedbackBubble = new FeedbackBubble({
      used: 'findAnimals',
      locX,
      locY,
      isCorrect,
    }).render();

    canvas.add(feedbackBubble);

    setTimeout(() => {
      canvas.remove(feedbackBubble);
    }, 1000);
  };

  // 문제 당 도전 횟수
  let challenges = 3;
  const resetChallenges = () => (challenges = 3);

  /**
   * 문제 제목 및 남은 문제 수 태그 생성 함수
   */
  const createQuetionTextContent = (currentOrder: number) => {
    $questionTitle.innerHTML = `
      <img src=\'/images/speech.png'\ alt='tts-icon' id='tts-icon' />
      &nbsp;
        ${currentOrder + 1}. ${Questions[currentOrder].title}를 찾아주세요.
    `;

    const questionTitleStyles = {
      fontSize: '24px',
      marginTop: '2rem',
    };

    Object.assign($questionTitle.style, questionTitleStyles);

    $questionRemaining.innerText = `남은 문제 수 : ${
      Questions.length - currentOrder
    }`;

    const questionRemainingStyles = {
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: '24px',
      marginRight: '1rem',
    };
    Object.assign($questionRemaining.style, questionRemainingStyles);
  };

  createQuetionTextContent(currentOrder);

  /**
   * 문제 생성 함수
   */
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
      const $questionTitle = document.querySelector('#question-title');

      ttsSpeech(voices, $questionTitle!.textContent!);
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
                resetChallenges();
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
                  createQuetionTextContent(currentOrder);
                  resetChallenges();
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
