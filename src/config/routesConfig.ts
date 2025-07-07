export const rootRoute = '/';
export const welcomeRoute = '/welcome';
export const infoRoute = '/info';
export const dataRoute = '/data'; // Example
export const topicsRoute = '/topics';
export const settingsRoute = '/settings';
export const adminRoute = '/admin';
export const chartsRoute = '/charts';
export const dashboardRoute = '/dashboard';

/** NOTE: That's used only to mock real intl context */
export const pathnames = {
  [rootRoute]: rootRoute,
  [welcomeRoute]: welcomeRoute,
  [infoRoute]: infoRoute,
  [dataRoute]: dataRoute,
  [topicsRoute]: topicsRoute,
  [settingsRoute]: settingsRoute,
  [adminRoute]: adminRoute,
  [chartsRoute]: chartsRoute,
  [dashboardRoute]: dashboardRoute,
};

export type TRoutePathKey = keyof typeof pathnames;
export type TRoutePath = keyof typeof pathnames;
