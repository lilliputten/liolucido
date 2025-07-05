import { cn } from '@/lib/utils';

export function TailwindIndicator() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div
      role="status"
      // var(--color-background);
      className={cn(
        'fixed',
        'bottom-4',
        'right-4',
        'z-50',
        'flex',
        'size-6',
        'items-center',
        'justify-center',
        'rounded-full',
        // 'bg-background',
        'bg-[rgb(28,28,30)]',
        'border',
        'border-white/15',
        'p-3.5',
        'font-mono',
        'text-xs',
        'text-white',
      )}
    >
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:max-md:block">sm</div>
      <div className="hidden md:max-lg:block">md</div>
      <div className="hidden lg:max-xl:block">lg</div>
      <div className="hidden xl:max-2xl:block">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
