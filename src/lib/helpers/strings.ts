interface TGetErrorTextOpts {
  omitErrorName?: boolean;
}

export function getErrorText(err: unknown, opts: TGetErrorTextOpts = {}): string {
  if (!err) {
    return '';
  }
  if (err instanceof Error) {
    // return String(err);
    return [
      // prettier-ignore
      !opts.omitErrorName && err.name,
      err.message,
    ]
      .filter(Boolean)
      .join(': ');
  }
  return String(err);
}

/** quoteHtmlAttr -- quote all invalid characters for html */
export function quoteHtmlAttr(str: string, preserveCR?: boolean) {
  const crValue = preserveCR ? '&#13;' : '\n';
  return (
    String(str) // Forces the conversion to string
      .replace(/&/g, '&amp;') // This MUST be the 1st replacement
      .replace(/'/g, '&apos;') // The 4 other predefined entities, required
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // You may add other replacements here for HTML only (but it's not
      // necessary). Or for XML, only if the named entities are defined in its
      // DTD.
      .replace(/\r\n/g, crValue) // Must be before the next replacement
      .replace(/[\r\n]/g, crValue)
  );
}

export function ucFirst(str: string) {
  const c = str.substring(0, 1);
  const rest = str.substring(1);
  return c.toUpperCase() + rest;
}
