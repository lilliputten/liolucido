import Image from 'next/image';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { SmallWelcomeText } from '@/components/screens/SmallWelcomeText';
import svgArt from '@/assets/arts/login-blue.svg';
import { isDev } from '@/constants';

export function WelcomeVisualBlock(props: TPropsWithClassName) {
  const { className } = props;
  return (
    <div
      className={cn(
        isDev && '__WelcomeVisualBlock', // DEBUG
        className,
        'm-4',
        'gap-4',
        'flex flex-1 flex-col',
        'items-stretch',
        'justify-center',
      )}
    >
      <Image
        // priority
        src={svgArt}
        alt="Sign in illustration"
        className={cn(
          isDev && '__WelcomeVisualBlock:Art', // DEBUG
          'mx-auto mt-4',
          'sm:max-w-xs',
        )}
      />

      {/* // XXX: Alternate layout: the art as a background
      <div
        className={cn(
          isDev && '__WelcomeVisualBlock:Art', // DEBUG
          'bg-contain',
          'bg-center',
          'bg-no-repeat',
        )}
        style={{
          // minHeight: '40vw',
          minHeight: '50vh',
          backgroundImage: 'url(/static/arts/login-blue.svg)',
        }}
      />
      */}

      <SmallWelcomeText />
    </div>
  );
}
