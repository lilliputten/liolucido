'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  /* XXX: Attempt to re-throw change event...
   * // Save the input node ref in the memo...
   * const memo = React.useMemo<{
   *   inputNode?: HTMLInputElement;
   *   // node?: HTMLButtonElement;
   * }>(() => ({}), []);
   */
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      /* XXX: Attempt to re-throw change event...
       * ref={(node) => {
       *   // Save ref and pass to the parent node (via forwardRef)
       *   memo.inputNode = node?.parentElement?.getElementsByTagName('input')[0];
       *   if (typeof ref === 'function') {
       *     ref(node);
       *   }
       * }}
       */
      className={cn(
        // '__Checkbox',
        'peer',
        'size-4',
        'shrink-0',
        'rounded-sm',
        'border',
        'border-input',
        'ring-offset-background',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        // 'data-[state=checked]:border-primary', // Original checkbox styling
        'data-[state=checked]:border-muted-foreground',
        className,
      )}
      /* XXX: Attempt to re-throw change event...
       * onCheckedChange={(checked) => {
       *   const { inputNode } = memo;
       *   const { onChange } = props;
       *   if (onChange && inputNode) {
       *     // @ts-ignore: To create correct typings for the event?
       *     onChange({ type: 'onChange', currentTarget: inputNode, target: inputNode });
       *   }
       * }}
       */
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          // '__Checkbox_Indicator',
          'flex',
          'items-center',
          'justify-center',
          // 'text-primary', // Original checkbox styling
          'text-muted-foreground',
        )}
      >
        <Check className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
