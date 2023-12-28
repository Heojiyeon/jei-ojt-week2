import MainPage from './pages';
import FindAnimalsPage from './pages/findAnimals';
import PuzzlePiecePage from './pages/puzzlePiece';
import ResultPage from './pages/result';
import { initRouter } from './utils/router';

type AppProp = {
  $app: HTMLDivElement | null;
};

// page 생성 및 라우팅
export default function App({ $app }: AppProp) {
  //정답 개수
  let countOfCorrect = 0;

  const setCountOfCorrect = () => {
    countOfCorrect += 1;
  };

  // 라우터 생성 함수
  const createRoute = () => {
    const { pathname } = window.location;

    if (pathname === '/') {
      MainPage({ $app });
    } else if (pathname === '/find-animals') {
      $app!.innerHTML = '';
      countOfCorrect = 0;
      FindAnimalsPage({ $app, setCountOfCorrect });
    } else if (pathname === '/puzzle-piece') {
      $app!.innerHTML = '';
      countOfCorrect = 0;
      PuzzlePiecePage({ $app, setCountOfCorrect });
    } else if (pathname === '/result') {
      $app!.innerHTML = '';
      ResultPage({ $app, countOfCorrect });
    }
  };

  createRoute();

  initRouter(() => createRoute());
}
