import { TPropsWithClassName, TReactNode } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { EmptyPlaceholder } from '@/components/shared/EmptyPlaceholder';
import * as Icons from '@/components/shared/Icons';
import { TGenericIcon } from '@/components/shared/IconTypes';

interface TPageEmptyProps extends TPropsWithClassName {
  title: string;
  description: string;
  onButtonClick?: () => void; // React.Dispatch<React.SetStateAction<void>>;
  buttonTitle?: TReactNode;
  icon?: TGenericIcon;
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
    icon = Icons.Warning,
    framed,
  } = props;
  const hasCustomButton = !!(onButtonClick && buttonTitle);
  const hasAnyButtons = !!(buttons || hasCustomButton);
  return (
    <EmptyPlaceholder className={cn(className, '__PageEmpty')} framed={framed}>
      <EmptyPlaceholder.Icon icon={icon} />
      <EmptyPlaceholder.Title>{title}</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>{description}</EmptyPlaceholder.Description>
      {hasAnyButtons && (
        <div className="flex w-full justify-center gap-4">
          {hasCustomButton && (
            <Button onClick={onButtonClick} className="flex gap-2">
              <Icons.Add className="hidden size-4 opacity-50 sm:flex" />
              {buttonTitle}
            </Button>
          )}
          {buttons}
        </div>
      )}
    </EmptyPlaceholder>
  );
}
