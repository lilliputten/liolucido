import Image from 'next/image';

import { TPropsWithClassName } from '@/shared/types/generic';

interface TProps extends TPropsWithClassName {
  dark?: boolean;
}

const logoSize = 36;

const logoSrc = '/static/logo/Logo.svg';

export function Logo(props: TProps) {
  const { className } = props;
  const src = /* dark ? logoBlueSrc : */ logoSrc;
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
