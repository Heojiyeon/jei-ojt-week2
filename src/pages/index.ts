import Button from '../components/common/Button';
import { push } from '../utils/router';

type MainProp = {
  $app: HTMLElement | null;
};

export default function MainPage({ $app }: MainProp) {
  if ($app?.innerHTML) {
    $app!.innerHTML = '';
  }

  /**
   * 메인 페이지 타이틀
   */
  const mainTitle = document.createElement('div');
  const subTitle = document.createElement('div');

  mainTitle.innerText = 'JEI';
  subTitle.innerText = '학습 컨텐츠';

  const mainTitleStyles = {
    color: '#E5001A',
    fontSize: '60px',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '4rem',
  };

  const subTitleStyles = {
    fontSize: '36px',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '3rem',
  };

  $app?.appendChild(mainTitle);
  $app?.appendChild(subTitle);

  Object.assign(mainTitle.style, mainTitleStyles);
  Object.assign(subTitle.style, subTitleStyles);

  /**
   * 게임 페이지 이동 버튼
   */
  const buttons = document.createElement('div');

  const findAnimalButton = buttons.appendChild(
    new Button({
      title: '동물 찾기',
      onClick: () => handleRouter('/find-animals'),
    }).render()
  );

  const puzzlePiece = buttons.appendChild(
    new Button({
      title: '동물 퍼즐',
      onClick: () => handleRouter('/puzzle-piece'),
    }).render()
  );

  const buttonsStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  Object.assign(buttons.style, buttonsStyles);

  buttons.appendChild(findAnimalButton);
  buttons.appendChild(puzzlePiece);

  const handleRouter = (nextUrl: string) => push(nextUrl);

  const render = () => {
    $app?.appendChild(buttons);
  };

  render();
}
