import React from 'react';
import { useRouter } from 'next/navigation';

import { rootRoute } from '@/config/routesConfig';

export function useGoToTheRoute() {
  const router = useRouter();
  /** Go to the route (via push or replace, according to the `replace` parameter */
  const goToTheRoute = React.useCallback(
    (routePath: string = rootRoute, replace?: boolean) => {
      const { href } = window.location;
      router.push(routePath);
      setTimeout(() => {
        // If still on the same page after trying to go back, fallback
        if (document.visibilityState === 'visible' && href === window.location.href) {
          if (replace) {
            router.replace(routePath);
          } else {
            router.push(routePath);
          }
        }
      }, 200);
    },
    [router],
  );

  return goToTheRoute;
}
