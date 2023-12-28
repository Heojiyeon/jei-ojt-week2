import Button from '../components/common/Button';
import { push } from '../utils/router';

type ResultProp = {
  $app: HTMLElement | null;
  countOfCorrect: number;
};

export default function ResultPage({ $app, countOfCorrect }: ResultProp) {
  const mainResult = document.createElement('div');
  const subResult = document.createElement('div');

  const button = document.createElement('div');

  mainResult.innerText = '학습 결과';
  subResult.innerText = `정답률 ${countOfCorrect}/4`;

  const mainResultStyles = {
    color: '#E5001A',
    fontSize: '60px',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '4rem',
    marginBottom: '3rem',
  };

  const subResultStyles = {
    fontSize: '36px',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '3rem',
  };

  Object.assign(mainResult.style, mainResultStyles);
  Object.assign(subResult.style, subResultStyles);

  const returnToMainButton = new Button({
    title: '처음으로 돌아가기',
    onClick: () => push('/'),
  }).render();

  const buttonStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5rem',
  };

  button.appendChild(returnToMainButton);

  Object.assign(button.style, buttonStyles);

  const render = () => {
    $app?.appendChild(mainResult);
    $app?.appendChild(subResult);
    $app?.appendChild(button);
  };

  render();
}
