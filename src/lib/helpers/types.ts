export function ensureBoolean(value?: boolean | number | string | null) {
  if (!value) {
    return false;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return Boolean(value);
  }
  if (typeof value === 'string') {
    if (['0', 'false', 'no'].includes(value.toLowerCase())) {
      return false;
    }
    return true;
  }
  return Boolean(value);
}

export function ensureNumber(value?: number | string | null) {
  if (!value) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    value = Number(value);
    return value && !isNaN(value) ? value : 0;
  }
  return Number(value);
}
