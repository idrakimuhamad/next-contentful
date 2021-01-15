import { NextRouter } from 'next/router';

export function isRouterReady(router) {
  return router.asPath !== router.route;
}
