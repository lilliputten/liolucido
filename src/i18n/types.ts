export const localesList = ['en', 'ru'];
export const defaultLocale = localesList[0];
export type TLocale = 'en' | 'ru'; // (typeof localesList)[number];
export type TLocaleParams = { locale: TLocale };
export type TLocaleProps = { params: TLocaleParams };
export type TAwaitedLocaleParams = Promise<TLocaleParams>;
export type TAwaitedLocaleProps = { params: TAwaitedLocaleParams };
