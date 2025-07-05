import { TRoutePath } from '@/i18n/routing';

export const rootRoute: TRoutePath = '/';
export const welcomeRoute: TRoutePath = '/welcome';
export const infoRoute: TRoutePath = '/info';
export const dataRoute: TRoutePath = '/data';

/** NOTE: That's used only to mock real intl context */
export const pathnames = {
  [rootRoute]: rootRoute,
  [welcomeRoute]: welcomeRoute,
  [infoRoute]: infoRoute,
  [dataRoute]: dataRoute,
};
