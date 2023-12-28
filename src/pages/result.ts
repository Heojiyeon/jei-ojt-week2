import Button from '../components/common/Button';
import { push } from '../utils/router';

type ResultProp = {
  $app: HTMLElement | null;
  countOfCorrect: number;
};

export default function ResultPage({ $app, countOfCorrect }: ResultProp) {
  const resultContent = document.createElement('div');

  const returnToMainButton = new Button({
    title: '처음으로 돌아가기',
    onClick: () => push('/'),
  }).render();
  resultContent.innerText = `정답률 ${countOfCorrect}/4`;

  const render = () => {
    $app?.appendChild(resultContent);
    $app?.appendChild(returnToMainButton);
  };

  render();
}
