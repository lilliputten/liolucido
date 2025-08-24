export type PossiblyEmpty<T = unknown> = T | false | 0 | '' | undefined | null;

/** Filter out empty items (false | 0 | '' | undefined | null) from an array */
export function filterOutEmpties<T = unknown>(list: PossiblyEmpty<T>[]) {
  return list.filter(Boolean) as T[];
}

export function generateArray(n: number) {
  return [...Array(n)].map((_, i) => i);
}
