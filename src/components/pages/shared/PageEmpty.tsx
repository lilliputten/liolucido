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
  buttons?: TReactNode;
  framed?: boolean;
}

export function PageEmpty(props: TPageEmptyProps) {
  const {
    className,
    title,
    description,
    buttonTitle,
    onButtonClick,
    buttons,
    iconName = 'warning',
    framed,
  } = props;
  const hasCustomButton = !!(onButtonClick && buttonTitle);
  const hasAnyButtons = !!(buttons || hasCustomButton);
  return (
    <EmptyPlaceholder className={cn(className, '__PageEmpty')} framed={framed}>
      <EmptyPlaceholder.Icon name={iconName} />
      <EmptyPlaceholder.Title>{title}</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>{description}</EmptyPlaceholder.Description>
      {hasAnyButtons && (
        <div className="flex w-full justify-center gap-4">
          {hasCustomButton && (
            <Button onClick={onButtonClick} className="flex gap-2">
              <Icons.add className="size-4" />
              {buttonTitle}
            </Button>
          )}
          {buttons}
        </div>
      )}
    </EmptyPlaceholder>
  );
}
