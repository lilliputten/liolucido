import { stringify } from 'yaml';

export function debugObj(obj: unknown) {
  return stringify(obj);
}
