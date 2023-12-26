import Button from '../components/common/Button';
import { push } from '../utils/router';

type MainProp = {
  $app: HTMLElement | null;
};

export default function MainPage({ $app }: MainProp) {
  if ($app?.innerHTML) {
    $app!.innerHTML = '';
  }

  const buttons = document.createElement('div');

  const findAnimalButton = buttons.appendChild(
    new Button({
      title: '동물 찾기 게임',
      onClick: () => handleRouter('/find-animals'),
    }).render()
  );

  const puzzlePiece = buttons.appendChild(
    new Button({
      title: '동물 퍼즐 게임',
      onClick: () => handleRouter('/puzzle-piece'),
    }).render()
  );

  buttons.appendChild(findAnimalButton);
  buttons.appendChild(puzzlePiece);

  const handleRouter = (nextUrl: string) => push(nextUrl);

  const render = () => {
    $app?.appendChild(buttons);
  };

  render();
}
