export type PossiblyEmpty<T = unknown> = T | false | 0 | '' | undefined | null;

/** Filter out empty items (false | 0 | '' | undefined | null) from an array */
export function filterOutEmpties<T = unknown>(list: PossiblyEmpty<T>[]) {
  return list.filter(Boolean) as T[];
}

/** Generate an empty array of given size */
export function generateArray(size: number) {
  return [...Array(size)].map((_, i) => i);
}
