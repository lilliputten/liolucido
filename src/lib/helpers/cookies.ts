/** @param {string} cookieId */
export function getCookie(cookieId: string) {
  const cookiesStr = document.cookie;
  const cookiesList = cookiesStr.split(';'); // .map((s) => s.trim().split('='));
  for (let i = 0; i < cookiesList.length; i++) {
    const s = cookiesList[i];
    const [id, val] = s.trim().split('=').map(decodeURIComponent);
    if (id === cookieId) {
      return val;
    }
  }
  return undefined;
}

/**
 * @param {string} id
 * @param {string} val
 * @param {number} [maxAgeSecs] -- Seconds of expire period
 */
export function setCookie(id: string, val: string, maxAgeSecs?: number) {
  const cookieVal = [id, val || ''].map(encodeURIComponent).join('=');
  const parts = [
    // prettier-ignore
    cookieVal,
    'path=/',
  ];
  if (maxAgeSecs) {
    parts.push('max-age=' + maxAgeSecs);
  }
  const fullCookie = parts.filter(Boolean).join(';');
  document.cookie = fullCookie;
}

export function deleteCookie(id: string) {
  document.cookie = id + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
