type ResultProp = {
  $app: HTMLElement | null;
};

export default function ResultPage({ $app }: ResultProp) {
  const resultContent = document.createElement('div');
  resultContent.innerHTML = '<div>결과 페이지</div>';

  const render = () => {
    $app?.appendChild(resultContent);
  };

  render();
}
