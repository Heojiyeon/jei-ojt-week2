type PuzzlePieceProp = {
  $app: HTMLElement | null;
};

export default function PuzzlePiecePage({ $app }: PuzzlePieceProp) {
  const puzzlePieceContent = document.createElement('div');
  puzzlePieceContent.innerHTML = '<div>동물 퍼즐 게임 페이지</div>';

  const render = () => {
    $app?.appendChild(puzzlePieceContent);
  };

  render();
}
