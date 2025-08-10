import { localesPathPrefixRegExp } from './types';

export function removePathLocalPrefix(path: string) {
  return path.replace(localesPathPrefixRegExp, '');
}

export function comparePathsWithoutLocalePrefix(path: string, cmpPath: string) {
  return path === cmpPath || path === removePathLocalPrefix(cmpPath);
}
