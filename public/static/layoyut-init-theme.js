/**
 * @module /static/layoyut-init-theme.js
 * @desc Load saved theme color ASAP...
 * This piece of code should be installed into the topmost layout with strategy="beforeInteractive"
 * @see https://nextjs.org/docs/messages/no-before-interactive-script-outside-document
 */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  /** @type {HTMLElement} */
  var html = document.body.parentNode;
  if (html) {
    var settingsJson = window.localStorage.getItem('settings');
    if (settingsJson && typeof window !== 'undefined') {
      try {
        /** @type {TSettings} */
        var settings = JSON.parse(settingsJson);
        if (settings.themeColor) {
          html.dataset.themeColor = settings.themeColor;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[layout] Can not parse local settings from', error);
        debugger; // eslint-disable-line no-debugger
      }
    }
  }
}
