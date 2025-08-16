export function safeJsonParse<T = unknown>(data: string | undefined | null, defaultValue: T) {
  if (!data) {
    return defaultValue;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}
