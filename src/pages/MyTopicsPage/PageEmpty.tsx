import { TPropsWithClassName, TReactNode } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EmptyPlaceholder } from '@/components/shared/EmptyPlaceholder';
import { Icons, TIconsKey } from '@/components/shared/icons';

interface TPageEmptyProps extends TPropsWithClassName {
  title: string;
  description: string;
  onButtonClick?: () => void; // React.Dispatch<React.SetStateAction<void>>;
  buttonTitle?: TReactNode;
  iconName?: TIconsKey;
}

export function PageEmpty(props: TPageEmptyProps) {
  const { className, title, description, buttonTitle, onButtonClick, iconName = 'warning' } = props;
  return (
    <EmptyPlaceholder className={cn(className, '__PageEmpty')}>
      <EmptyPlaceholder.Icon name={iconName} />
      <EmptyPlaceholder.Title>{title}</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>{description}</EmptyPlaceholder.Description>
      {!!(onButtonClick && buttonTitle) && (
        <div className="flex w-full justify-center gap-4">
          <Button onClick={onButtonClick}>
            <Icons.add className="mr-2 size-4" />
            {buttonTitle}
          </Button>
        </div>
      )}
    </EmptyPlaceholder>
  );
}
