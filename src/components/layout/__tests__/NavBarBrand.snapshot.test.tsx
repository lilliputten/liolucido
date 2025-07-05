/** @jest-environment jsdom
 */

import '@/jest/jestDomSetup';
import '@/jest/jestReactSetup';

import { render } from '@testing-library/react';

import { NavBarBrand } from '../NavBarBrand';

it('NavBarBrand snapshot', () => {
  const { container } = render(<NavBarBrand isUser={false} isUserRequired={false} />);
  expect(container).toMatchSnapshot();
});
