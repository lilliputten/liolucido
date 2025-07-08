export const adminRoute = '/admin';
export const chartsRoute = '/charts';
export const dashboardRoute = '/dashboard';
export const dataRoute = '/data'; // Example
export const infoRoute = '/info';
export const myTopicsRoute = '/my-topics';
export const rootRoute = '/';
export const settingsRoute = '/settings';
export const topicsRoute = '/topics';
export const welcomeRoute = '/welcome';

/** NOTE: That's used only to mock real intl context */
export const pathnames = {
  [adminRoute]: adminRoute,
  [chartsRoute]: chartsRoute,
  [dashboardRoute]: dashboardRoute,
  [dataRoute]: dataRoute,
  [infoRoute]: infoRoute,
  [myTopicsRoute]: myTopicsRoute,
  [rootRoute]: rootRoute,
  [settingsRoute]: settingsRoute,
  [topicsRoute]: topicsRoute,
  [welcomeRoute]: welcomeRoute,
};

export type TRoutePathKey = keyof typeof pathnames;
export type TRoutePath = keyof typeof pathnames;
