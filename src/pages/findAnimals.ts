type FindAnimalsPageProp = {
  $app: HTMLElement | null;
};

export default function FindAnimalsPage({ $app }: FindAnimalsPageProp) {
  const findAnimalContent = document.createElement('div');
  findAnimalContent.innerHTML = '<div>동물 찾기 게임 페이지</div>';

  const render = () => {
    $app?.appendChild(findAnimalContent);
  };

  render();
}
