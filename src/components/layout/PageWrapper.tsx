import { TPropsWithChildrenAndClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { MaxWidthWrapper } from '@/components/shared/MaxWidthWrapper';
import { TLayoutType, UseScrollableLayout } from '@/components/shared/ScrollableLayout';
import { isDev } from '@/constants';

const saveScrollHash = getRandomHashString();

interface TPageWrapperProps extends TPropsWithChildrenAndClassName {
  id?: string;
  innerClassName?: string;
  scrollable?: boolean;
  limitWidth?: boolean;
  padded?: boolean;
  vPadded?: boolean;
  layoutType?: TLayoutType;
}

export function PageWrapper(props: TPageWrapperProps) {
  const {
    id,
    className,
    children,
    scrollable,
    limitWidth,
    padded,
    vPadded,
    layoutType = 'clippable',
    innerClassName,
  } = props;

  let content = children;

  content = (
    <div
      className={cn(
        isDev && '__PageWrapper_InnerWrapper', // DEBUG
        'flex flex-1 flex-col',
        !scrollable && 'overflow-hidden',
        innerClassName,
      )}
    >
      {content}
    </div>
  );

  if (scrollable) {
    content = (
      <ScrollArea
        saveScrollKey={id && `Scroll-${id}`}
        saveScrollHash={saveScrollHash}
        className={cn(
          isDev && '__PageWrapper_Scroll', // DEBUG
          'flex flex-col items-center',
          'layout-scrollable',
        )}
        viewportClassName={cn(
          isDev && '__PageWrapper_Viewport', // DEBUG
          'flex-1 flex flex-col',
          '[&>div]:!flex [&>div]:flex-1',
        )}
      >
        {content}
      </ScrollArea>
    );
  }

  if (limitWidth) {
    content = (
      <MaxWidthWrapper
        className={cn(
          isDev && '__PageWrapper_Wrapper', // DEBUG
          'flex flex-1 flex-col',
          'layout-follow',
          'm-auto',
        )}
      >
        {content}
      </MaxWidthWrapper>
    );
  }

  return (
    <div
      className={cn(
        isDev && '__PageWrapper', // DEBUG
        'flex flex-1 flex-col items-center',
        'overflow-hidden',
        padded && 'mx-4', // commonXMarginTwStyle,
        vPadded && 'my-4', // commonYMarginTwStyle,
        className,
      )}
    >
      <UseScrollableLayout type={layoutType} />
      {content}
    </div>
  );
}
