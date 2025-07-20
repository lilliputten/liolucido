export const localesList = ['en', 'ru'];
export const defaultLocale = localesList[0];
export type TLocale = 'en' | 'ru'; // (typeof localesList)[number];
export type TLocaleParams = { locale: TLocale };
export type TLocaleProps = { params: TLocaleParams };
// TODO: Define extendable params type (allowing to receive other properties
export type TAwaitedLocaleParams<T = void> = Promise<TLocaleParams & T>;
export type TAwaitedLocaleProps<T = void> = { params: TAwaitedLocaleParams<T> };
