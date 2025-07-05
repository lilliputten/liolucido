import Image from 'next/image';

import { TPropsWithClassName } from '@/shared/types/generic';

interface TProps extends TPropsWithClassName {
  dark?: boolean;
  // size?: TLogoSize;
}

const logoSize = 36;

const logoWhiteSrc = '/static/logo/LogoWhite-min.svg';
const logoBlueSrc = '/static/logo/LogoBlue-min.svg';

export function Logo(props: TProps) {
  const { className, dark } = props;
  // Use memo for `src`?
  const src = dark ? logoBlueSrc : logoWhiteSrc;
  return (
    <Image
      // prettier-ignore
      src={src}
      className={className}
      width={logoSize}
      height={logoSize}
      alt="Logo"
    />
  );
}
