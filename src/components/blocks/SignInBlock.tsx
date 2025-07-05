import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { SignInForm, SignInFormHeader } from '@/components/forms/SignInForm';
import { isDev } from '@/constants';

export function SignInBlock(props: TPropsWithClassName) {
  const { className } = props;
  return (
    <div
      className={cn(
        isDev && '__SignInBlock', // DEBUG
        className,
        'w-full',
        'flex flex-1 flex-col',
        'items-stretch',
        'justify-center',
        'max-w-md',
        'm-auto',
      )}
    >
      <div
        className={cn(
          // prettier-ignore
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'space-y-3',
          'px-4',
          'py-6',
          'pt-8',
          'md:px-16',
        )}
      >
        <SignInFormHeader dark />
      </div>
      <div
        className={cn(
          // prettier-ignore
          'flex',
          'flex-col',
          'space-y-4',
          // 'bg-primary-400',
          'px-4',
          'py-8',
          'md:px-16',
        )}
      >
        <SignInForm inBody />
      </div>
    </div>
  );
}
