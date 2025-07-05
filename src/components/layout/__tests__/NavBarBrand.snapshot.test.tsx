/** @jest-environment jsdom
 */

import '@/jest/jestDomSetup';

import { render } from '@testing-library/react';

import { NavBarBrand } from '../NavBarBrand';

jest.mock('next-intl', () => ({
  useLocale() {
    return 'en';
  },
}));

it('NavBarBrand snapshot', () => {
  const { container } = render(<NavBarBrand isUser={false} isUserRequired={false} />);
  expect(container).toMatchSnapshot();
});
