import Image from 'next/image';

import { TPropsWithClassName } from '@/shared/types/generic';
import logoImageWhiteSvg from '@/assets/logo/logo-image-w.svg';
import logoImageSvg from '@/assets/logo/logo-image.svg';

interface TProps extends TPropsWithClassName {
  dark?: boolean;
}

export function Logo(props: TProps) {
  const { dark, className } = props;
  const src = dark ? logoImageWhiteSvg : logoImageSvg;
  return (
    <Image
      src={src}
      className={className}
      // width={logoSize}
      // height={logoSize}
      alt="Logo"
      // priority={false}
    />
  );
}
