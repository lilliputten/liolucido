export const localesList = ['en', 'ru'] as const;
export type TLocale = (typeof localesList)[number];
export const defaultLocale: TLocale = localesList[0];
export type TLocaleParams = { locale: TLocale };
export type TLocaleProps = { params: TLocaleParams };
// TODO: Define extendable params type (allowing to receive other properties
export type TAwaitedLocaleParams<T = void> = Promise<TLocaleParams & T>;
export type TAwaitedLocaleProps<T = void> = { params: TAwaitedLocaleParams<T> };
