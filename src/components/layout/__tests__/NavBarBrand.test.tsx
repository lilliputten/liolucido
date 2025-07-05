/** @jest-environment jsdom
 */

import '@/jest/jestDomSetup';

import { render, screen } from '@testing-library/react';

import { getErrorText } from '@/lib/helpers/strings';

import { NavBarBrand } from '../NavBarBrand';

jest.mock('next-intl', () => ({
  useLocale() {
    return 'en';
  },
}));

describe('NavBarBrand', () => {
  it('renders a heading', () => {
    try {
      render(<NavBarBrand isUser={false} isUserRequired={false} />);
      const titleNode = screen.getByTestId('NavBarBrandTitle');
      expect(titleNode).toBeInTheDocument();
    } catch (error) {
      const nextText = 'Content test error';
      const errorMessage = getErrorText(error);
      const nextMessage = [nextText, errorMessage].filter(Boolean).join(': ');
      const nextError = new Error(nextMessage);
      // eslint-disable-next-line no-console
      console.error('[NavBarBrand.test]', nextMessage, {
        nextError,
        errorMessage,
        error,
      });
      debugger; // eslint-disable-line no-debugger
      // NOTE: Re-throw an error
      throw nextError;
    }
  });
});
