const ROUTE_CHANGE_EVENT_NAME = 'route-change';

export const initRouter = (onRoute: () => void) => {
  window.addEventListener(ROUTE_CHANGE_EVENT_NAME, event => {
    const { nextUrl } = (<CustomEvent>event).detail;
    if (nextUrl) {
      history.pushState(null, '', nextUrl);
      onRoute();
    }
  });
};

export const push = (nextUrl: string) => {
  window.dispatchEvent(
    new CustomEvent(ROUTE_CHANGE_EVENT_NAME, {
      detail: {
        nextUrl,
      },
    })
  );
};
