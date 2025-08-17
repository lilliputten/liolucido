type TUrlParamValue = string | number | boolean | undefined | null;

interface TComposeUrlOptions {
  omitEmpty?: boolean;
  omitFalsy?: boolean;
}

/** Compose an url from the url base and parameters hash
 * @param {string} baseUrl
 * @param {object} params
 * @param {TComposeUrlOptions} options
 * @param {boolean} [options.omitEmpty=true] - Skip all undefined (or null) values (default=true)
 * @param {boolean} [options.omitFalsy] - Skip all falsy values
 */
export function composeUrl(
  baseUrl: string,
  params: Record<string, TUrlParamValue>,
  options: TComposeUrlOptions = {},
): string {
  const { omitEmpty = true, omitFalsy } = options;
  const queryString = Object.entries(params)
    // Filter non-empty values
    .filter(([key, value]) => key && (!omitEmpty || value != undefined) && (!omitFalsy || !!value))
    // Create a 'key=value' string
    .map((pair) => pair.map(String).map(encodeURIComponent).join('='))
    // Combine with '&'
    .join('&');
  // Return final url
  return [baseUrl, queryString && '?' + queryString].filter(Boolean).join('');
}
