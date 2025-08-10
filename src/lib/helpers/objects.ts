/** Remove all falsy values from the object */
export function removeFalsyValues(obj: Record<string, unknown>) {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key];
    }
  });
  return obj;
}

/** Remove null or undefined values from the object */
export function removeNullUndefinedValues(obj: Record<string, unknown>) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}
